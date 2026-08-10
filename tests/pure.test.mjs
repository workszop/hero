import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const APP_PATH = path.resolve(import.meta.dirname, '..', 'index.html');
const APP_SOURCE = fs.readFileSync(APP_PATH, 'utf8');
const HERO_DIR = path.dirname(APP_PATH);
const DEAD_SIGNAL_ASSET_DIR = path.resolve(HERO_DIR, 'assets', 'dead-signal');
const STYLE_SOURCE = APP_SOURCE.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? '';

function loadPureHelpers() {
    const match = APP_SOURCE.match(
        /\/\* pure-helpers-start \*\/([\s\S]*?)\/\* pure-helpers-end \*\//
    );
    assert.ok(match, 'index.html must expose a pure helper block for headless checks');

    const sandbox = {};
    vm.runInNewContext(
        `${match[1]}\nthis.helpers = {\n` +
        'shuffle, selectQuestionsFromModel, buildSceneAssignments, calculateRealityIntegrity, ' +
        'determineWinner, generateMisleadingSignals, generateFakeResultSignals, ' +
        'createSeededRandom, generateColliderRun, validateModel, buildShareText\n};',
        sandbox,
        { filename: APP_PATH }
    );
    return sandbox.helpers;
}

const helpers = loadPureHelpers();

function makeSyntheticModel({ missingCategory = null, shortQuestionCategory = null } = {}) {
    const genreCategoryIds = [1, 2];
    const realityCategoryId = 14;
    const allCategoryIds = [...genreCategoryIds, realityCategoryId];
    const categories = Object.fromEntries(
        allCategoryIds
            .filter(id => id !== missingCategory)
            .map(id => [id, {
                name: `Category ${id}`,
                result: `Result ${id}`,
                scene: `scene-${id}-01.webp`,
                sceneAlt: `Scene ${id} one`,
                sceneKey: `scene-${id}`,
                sceneVariants: [
                    { src: `scene-${id}-02.webp`, alt: `Scene ${id} two` },
                    { src: `scene-${id}-03.webp`, alt: `Scene ${id} three` }
                ]
            }])
    );
    const categoryShortNames = Object.fromEntries(
        allCategoryIds.map(id => [id, `Short ${id}`])
    );
    const categoryThemes = Object.fromEntries(
        allCategoryIds.map(id => [id, { bg: `theme-${id}`, name: `theme-${id}` }])
    );
    const genreStories = Object.fromEntries(
        allCategoryIds.map(id => [id, { genre: `Genre ${id}`, stories: [`Story ${id}`] }])
    );
    const resultStories = Object.fromEntries(
        allCategoryIds.map(id => [id, `Result story ${id}`])
    );
    const questions = allCategoryIds.flatMap(categoryId => {
        const count = categoryId === realityCategoryId ? 3 : 3;
        return Array.from({ length: count }, (_, index) => ({
            id: `${categoryId}-${index}`,
            categoryId,
            text: `Question ${categoryId}-${index}`
        }));
    });

    if (shortQuestionCategory !== null) {
        const index = questions.findIndex(question => question.categoryId === shortQuestionCategory);
        questions.splice(index, 2);
    }

    return {
        config: {
            genreCategoryIds,
            realityCategoryId,
            genreQuestionsPerCategory: 2,
            realityQuestionCount: 2,
            ordinaryThreshold: 1,
            sceneFallback: 'fallback.webp',
            tiePriority: [realityCategoryId, ...genreCategoryIds]
        },
        categories,
        categoryShortNames,
        categoryThemes,
        genreStories,
        resultStories,
        questions
    };
}

function sequenceRandom(values) {
    let index = 0;
    return () => values[index++ % values.length];
}

test('selectQuestionsFromModel is deterministic and preserves configured category counts', () => {
    const model = makeSyntheticModel();
    const randomValues = [0.1, 0.8, 0.2, 0.7, 0.3, 0.6, 0.4, 0.5, 0.9, 0.05, 0.95];
    const first = helpers.selectQuestionsFromModel(model, sequenceRandom(randomValues));
    const second = helpers.selectQuestionsFromModel(model, sequenceRandom(randomValues));

    assert.deepEqual(first, second);
    assert.equal(first.length, 6);
    for (const categoryId of model.config.genreCategoryIds) {
        assert.equal(first.filter(question => question.categoryId === categoryId).length, 2);
    }
    assert.equal(
        first.filter(question => question.categoryId === model.config.realityCategoryId).length,
        2
    );
});

test('buildSceneAssignments exhausts category pools before reuse without immediate repeats', () => {
    const categories = {
        1: {
            scene: 'one.webp',
            sceneAlt: 'Scene one',
            sceneVariants: [
                { src: 'two.webp', alt: 'Scene two' },
                { src: 'three.webp', alt: 'Scene three' }
            ]
        }
    };
    const selectedQuestions = Array.from({ length: 7 }, () => ({ categoryId: 1 }));
    const assignments = helpers.buildSceneAssignments(
        selectedQuestions,
        categories,
        sequenceRandom([0.8, 0.2, 0.6, 0.9, 0.1, 0.7, 0.4, 0.3])
    );
    const paths = assignments.map(scene => scene.src);

    assert.equal(new Set(paths.slice(0, 3)).size, 3, 'the first scene cycle must be unique');
    assert.equal(new Set(paths.slice(3, 6)).size, 3, 'the second scene cycle must be unique');
    for (let index = 1; index < paths.length; index += 1) {
        assert.notEqual(paths[index], paths[index - 1], 'a scene must not repeat immediately');
    }
    assert.ok(assignments.every(scene => scene.categoryId === 1 && scene.alt));
});

test('the production category pools assign distinct scenes across an actual 30-question run', () => {
    const categories = vm.runInNewContext(`({${extractCategoriesSource()}})`);
    const selectedQuestions = [];
    for (let categoryId = 1; categoryId <= 13; categoryId += 1) {
        selectedQuestions.push({ categoryId }, { categoryId });
    }
    selectedQuestions.push(
        { categoryId: 14 },
        { categoryId: 14 },
        { categoryId: 14 },
        { categoryId: 14 }
    );

    const assignments = helpers.buildSceneAssignments(
        selectedQuestions,
        categories,
        sequenceRandom([0.72, 0.18, 0.91, 0.44, 0.63, 0.27])
    );
    assert.equal(assignments.length, 30);

    for (let categoryId = 1; categoryId <= 13; categoryId += 1) {
        const paths = assignments
            .filter(scene => scene.categoryId === categoryId)
            .map(scene => scene.src);
        assert.equal(paths.length, 2);
        assert.equal(new Set(paths).size, 2, `category ${categoryId} must show two distinct scenes`);
    }

    const realityPaths = assignments
        .filter(scene => scene.categoryId === 14)
        .map(scene => scene.src);
    assert.equal(new Set(realityPaths.slice(0, 3)).size, 3);
    for (let index = 1; index < realityPaths.length; index += 1) {
        assert.notEqual(realityPaths[index], realityPaths[index - 1]);
    }
});

test('ordinary threshold deliberately favors the Reality diagnosis for low scores', () => {
    const winner = helpers.determineWinner(
        { 1: 1, 2: 0, 14: 0 },
        1,
        [14, 1, 2],
        14
    );
    assert.equal(JSON.stringify(winner), JSON.stringify({
        categoryId: 14,
        maxScore: 1,
        ordinaryByThreshold: true
    }));

    const aboveThreshold = helpers.determineWinner(
        { 1: 2, 2: 0, 14: 0 },
        1,
        [14, 1, 2],
        14
    );
    assert.equal(aboveThreshold.categoryId, 1);
    assert.equal(aboveThreshold.ordinaryByThreshold, false);
});

test('Reality wins tied scores deterministically, independent of score object order', () => {
    const priority = [14, 1, 2];
    const first = helpers.determineWinner({ 1: 2, 14: 2, 2: 0 }, 1, priority, 14);
    const second = helpers.determineWinner({ 2: 0, 14: 2, 1: 2 }, 1, priority, 14);

    assert.equal(first.categoryId, 14);
    assert.equal(second.categoryId, 14);
    assert.equal(first.maxScore, 2);
    assert.equal(first.ordinaryByThreshold, false);
});

test('misleading genre signals are randomized percentages and always include Reality', () => {
    const categoryIds = [1, 2, 3, 4, 5, 6, 14];
    const first = helpers.generateMisleadingSignals(
        categoryIds,
        14,
        sequenceRandom([0.05, 0.85, 0.2, 0.7, 0.4, 0.95, 0.1])
    );
    const second = helpers.generateMisleadingSignals(
        categoryIds,
        14,
        sequenceRandom([0.9, 0.1, 0.75, 0.3, 0.65, 0.15, 0.8])
    );

    assert.equal(first.length, 5);
    assert.ok(first.some(signal => signal.id === 14));
    assert.ok(second.some(signal => signal.id === 14));
    assert.ok(first.every(signal => signal.percentage >= 7 && signal.percentage <= 99));
    assert.notDeepEqual(first, second);
});

test('fake result signals are randomized percentages with the diagnosis as a clear winner', () => {
    const categoryIds = Array.from({ length: 14 }, (_, index) => index + 1);
    const first = helpers.generateFakeResultSignals(
        categoryIds,
        8,
        sequenceRandom([0.04, 0.82, 0.21, 0.67, 0.33, 0.94, 0.12])
    );
    const second = helpers.generateFakeResultSignals(
        categoryIds,
        8,
        sequenceRandom([0.77, 0.16, 0.58, 0.29, 0.88, 0.45, 0.09])
    );

    assert.equal(first.length, 14);
    assert.equal(first[0].id, 8);
    assert.ok(first[0].percentage >= 90 && first[0].percentage < 99);
    assert.ok(first.slice(1).every(signal => signal.percentage < 80));
    assert.equal(new Set(first.map(signal => signal.percentage)).size, 14);
    assert.ok(first.every(signal => Number.isInteger(signal.percentage * 10)));
    assert.notDeepEqual(first, second);
});

test('collider runs are seeded, complete and preserve every diagnosed winner', () => {
    const categoryIds = Array.from({ length: 14 }, (_, index) => index + 1);
    const first = helpers.generateColliderRun(categoryIds, 14, 123456);
    const repeated = helpers.generateColliderRun(categoryIds, 14, 123456);
    const second = helpers.generateColliderRun(categoryIds, 14, 654321);

    assert.equal(JSON.stringify(first), JSON.stringify(repeated));
    assert.notEqual(JSON.stringify(first), JSON.stringify(second));
    assert.equal(first.signals.length, 14);
    assert.equal(first.regression.length, 30);
    assert.equal(first.coefficients.length, 5);
    assert.ok(Object.values(first.metrics).every(Number.isFinite));

    for (const winningId of categoryIds) {
        const run = helpers.generateColliderRun(categoryIds, winningId, 9000 + winningId);
        assert.equal(run.signals[0].id, winningId);
        assert.ok(run.signals[0].percentage >= 90 && run.signals[0].percentage < 99);
        assert.ok(run.signals.slice(1).every(signal => signal.percentage < 80));
        assert.equal(run.signals.filter(signal => signal.id === winningId).length, 1);
    }
});

test('reality integrity is always bounded between zero and one hundred', () => {
    for (const points of [-10, -1, 0, 1, 20, 34, 100]) {
        const value = helpers.calculateRealityIntegrity(points);
        assert.ok(value >= 0 && value <= 100, `integrity ${value} escaped bounds for ${points}`);
    }
    assert.equal(helpers.calculateRealityIntegrity(0), 100);
    assert.equal(helpers.calculateRealityIntegrity(-1), 100);
    assert.equal(helpers.calculateRealityIntegrity(34), 0);
});

test('validateModel accepts a complete synthetic model and reports missing data', () => {
    const validModel = makeSyntheticModel();
    assert.equal(helpers.validateModel(validModel).length, 0);

    const missingCategoryModel = makeSyntheticModel({ missingCategory: 2 });
    const errors = helpers.validateModel(missingCategoryModel);
    assert.ok(errors.includes('Missing category 2'));
    assert.ok(errors.length > 0);

    const shortQuestionsModel = makeSyntheticModel({ shortQuestionCategory: 1 });
    assert.ok(helpers.validateModel(shortQuestionsModel).includes('Category 1 has 1/2 questions'));

    const shortScenePoolModel = makeSyntheticModel();
    shortScenePoolModel.categories[1].sceneVariants.pop();
    assert.ok(
        helpers.validateModel(shortScenePoolModel).includes('Category 1 needs two scene variants')
    );

    const duplicateSceneModel = makeSyntheticModel();
    duplicateSceneModel.categories[1].sceneVariants[0].src = duplicateSceneModel.categories[1].scene;
    assert.ok(helpers.validateModel(duplicateSceneModel).includes('Duplicate scene path 1'));
});

test('buildShareText includes the result title and canonical URL', () => {
    const title = 'Regular Miserable Person';
    const url = 'https://workszop.github.io/hero/#result=14';
    const shareText = helpers.buildShareText(title, url);

    assert.match(shareText, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(shareText, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(shareText, /Find out:/);
});

test('the app has no inline event handlers', () => {
    assert.doesNotMatch(APP_SOURCE, /\s+on[a-z]+\s*=\s*["']/i);
});

test('the root and interactive controls publish the DOM contract', () => {
    const rootMatch = APP_SOURCE.match(/<main\b[^>]*\bid="appRoot"[^>]*>/i);
    assert.ok(rootMatch, 'appRoot main element is required');
    const root = rootMatch[0];
    for (const attribute of [
        'data-screen',
        'data-question-index',
        'data-quiz-length',
        'data-transitioning',
        'data-reality-integrity',
        'data-result-category',
        'data-result-signal-percent',
        'data-analysis-layout',
        'data-analysis-mode',
        'data-analysis-seed',
        'data-analysis-winner'
    ]) {
        assert.match(root, new RegExp(`\\b${attribute}\\s*=`), `${attribute} is required`);
    }

    assert.match(APP_SOURCE, /id="progressTimeline"[^>]*role="progressbar"/i);
    assert.match(APP_SOURCE, /data-answer="yes"/i);
    assert.match(APP_SOURCE, /data-answer="no"/i);
    assert.match(APP_SOURCE, /id="appStatus"[^>]*role="status"[^>]*aria-live="polite"/i);
});

test('every static DOM id reference resolves to markup', () => {
    const referencedIds = [...APP_SOURCE.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)]
        .map(match => match[1]);
    const markupIds = new Set(
        [...APP_SOURCE.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1])
    );

    for (const id of referencedIds) {
        assert.ok(markupIds.has(id), `document.getElementById('${id}') needs matching markup`);
    }
});

// ─── Dead Signal visual contract ───

function findMatchingBrace(source, openingIndex) {
    let depth = 0;
    let quote = null;
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let index = openingIndex; index < source.length; index += 1) {
        const character = source[index];
        const nextCharacter = source[index + 1];

        if (lineComment) {
            if (character === '\n') lineComment = false;
            continue;
        }
        if (blockComment) {
            if (character === '*' && nextCharacter === '/') {
                blockComment = false;
                index += 1;
            }
            continue;
        }
        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (character === '\\') {
                escaped = true;
            } else if (character === quote) {
                quote = null;
            }
            continue;
        }
        if (character === '/' && nextCharacter === '/') {
            lineComment = true;
            index += 1;
            continue;
        }
        if (character === '/' && nextCharacter === '*') {
            blockComment = true;
            index += 1;
            continue;
        }
        if (character === '"' || character === "'" || character === '`') {
            quote = character;
            continue;
        }
        if (character === '{') {
            depth += 1;
        } else if (character === '}') {
            depth -= 1;
            if (depth === 0) return index;
        }
    }

    return -1;
}

function extractCategoriesSource() {
    const declaration = /(?:const|let|var)\s+categories\s*=\s*\{/i.exec(APP_SOURCE);
    assert.ok(declaration, 'index.html must expose a categories object');
    const openingIndex = declaration.index + declaration[0].lastIndexOf('{');
    const closingIndex = findMatchingBrace(APP_SOURCE, openingIndex);
    assert.notEqual(closingIndex, -1, 'categories object must be closed');
    return APP_SOURCE.slice(openingIndex + 1, closingIndex);
}

function extractCategorySource(categoriesSource, categoryId) {
    const keyPattern = new RegExp(
        `(?:^|\\n)\\s*["']?${categoryId}["']?\\s*:\\s*\\{`,
        'm'
    );
    const match = keyPattern.exec(categoriesSource);
    assert.ok(match, `category ${categoryId} must be present in categories`);

    const openingIndex = match.index + match[0].lastIndexOf('{');
    const closingIndex = findMatchingBrace(categoriesSource, openingIndex);
    assert.notEqual(closingIndex, -1, `category ${categoryId} object must be closed`);
    return categoriesSource.slice(openingIndex + 1, closingIndex);
}

function getCategoryField(categorySource, fieldName, categoryId) {
    const fieldPattern = new RegExp(
        `(?:^|[\\s,{])(?:["']?${fieldName}["']?)\\s*:\\s*(["'\\x60])([^"'\\x60]+)\\1`,
        'm'
    );
    const match = fieldPattern.exec(categorySource);
    assert.ok(match, `category ${categoryId} must define ${fieldName}`);
    return match[2];
}

test('app root declares the Dead Signal visual theme', () => {
    const rootMatch = APP_SOURCE.match(/<main\b[^>]*\bid=["']appRoot["'][^>]*>/i);
    assert.ok(rootMatch, 'appRoot main element is required');
    assert.match(rootMatch[0], /\bdata-visual-theme=["']dead-signal["']/i);
});

test('Dead Signal semantic tokens and fonts are defined', () => {
    const requiredTokens = [
        '--ds-bg',
        '--ds-screen',
        '--ds-frame',
        '--ds-panel',
        '--ds-line',
        '--ds-line-dim',
        '--ds-signal',
        '--ds-signal-bright',
        '--ds-phosphor',
        '--ds-amber',
        '--ds-alert',
        '--ds-ink',
        '--ds-muted',
        '--ds-shadow'
    ];

    for (const token of requiredTokens) {
        assert.match(
            STYLE_SOURCE,
            new RegExp(`${token.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*:`, 'i'),
            `${token} must be defined in the style token block`
        );
    }
    assert.match(STYLE_SOURCE, /--font-pixel\s*:/i);
    assert.match(STYLE_SOURCE, /--font-mono\s*:/i);
    assert.match(APP_SOURCE, /Silkscreen/i, 'Silkscreen must be referenced');
    assert.match(APP_SOURCE, /Space\s+Mono/i, 'Space Mono must be referenced');
});

test('every category maps to three unique local signal scenes with meaningful metadata', () => {
    const categoriesSource = extractCategoriesSource();
    const scenePaths = [];

    for (let categoryId = 1; categoryId <= 14; categoryId += 1) {
        const categorySource = extractCategorySource(categoriesSource, categoryId);
        const scenePath = getCategoryField(categorySource, 'scene', categoryId);
        const sceneAlt = getCategoryField(categorySource, 'sceneAlt', categoryId);
        getCategoryField(categorySource, 'sceneKey', categoryId);
        const variantsMatch = categorySource.match(/sceneVariants\s*:\s*\[([\s\S]*?)\]/i);
        assert.ok(variantsMatch, `category ${categoryId} must define sceneVariants`);
        const variants = [...variantsMatch[1].matchAll(
            /\{\s*src\s*:\s*["']([^"']+)["']\s*,\s*alt\s*:\s*["']([^"']+)["']\s*\}/gi
        )].map(match => ({ src: match[1], alt: match[2] }));
        assert.equal(variants.length, 2, `category ${categoryId} must have two scene variants`);

        assert.ok(sceneAlt.trim().length > 0, `category ${categoryId} sceneAlt must not be empty`);
        const categoryScenes = [
            { src: scenePath, alt: sceneAlt },
            ...variants
        ];
        for (const scene of categoryScenes) {
            assert.ok(scene.alt.trim().length > 0, `category ${categoryId} scene alt must not be empty`);
            const normalizedScenePath = scene.src.replace(/^\.\//, '');
            assert.match(
                normalizedScenePath,
                /^assets\/dead-signal\/[^/]+\.webp$/i,
                `category ${categoryId} scene must be a production WebP under assets/dead-signal`
            );
            const absoluteScenePath = path.resolve(HERO_DIR, normalizedScenePath);
            assert.ok(
                absoluteScenePath.startsWith(`${DEAD_SIGNAL_ASSET_DIR}${path.sep}`),
                `category ${categoryId} scene must stay inside assets/dead-signal`
            );
            assert.ok(
                fs.existsSync(absoluteScenePath),
                `category ${categoryId} configured scene is missing: ${normalizedScenePath}`
            );
            scenePaths.push(normalizedScenePath);
        }
    }

    assert.equal(
        new Set(scenePaths).size,
        42,
        'all category scene paths must be unique'
    );
});

test('the configured Dead Signal fallback scene exists locally', () => {
    const fallbackPath = 'assets/dead-signal/fallback.webp';
    assert.match(
        APP_SOURCE,
        new RegExp(fallbackPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')),
        'index.html must configure fallback.webp'
    );
    assert.ok(
        fs.existsSync(path.resolve(HERO_DIR, fallbackPath)),
        `${fallbackPath} must exist`
    );
});

test('index.html contains no retired purple brand values', () => {
    const retiredValues = [
        /#667eea\b/i,
        /#764ba2\b/i,
        /#1a0033\b/i,
        /%23667eea\b/i,
        /%23764ba2\b/i,
        /%231a0033\b/i,
        /rgba?\(\s*102\s*,\s*126\s*,\s*234(?:\s*(?:,|\/)[^)]*)?\s*\)/i,
        /rgba?\(\s*118\s*,\s*75\s*,\s*162(?:\s*(?:,|\/)[^)]*)?\s*\)/i,
        /rgba?\(\s*26\s*,\s*0\s*,\s*51(?:\s*(?:,|\/)[^)]*)?\s*\)/i
    ];

    const matches = retiredValues
        .map(pattern => APP_SOURCE.match(pattern)?.[0])
        .filter(Boolean);
    assert.deepEqual(matches, [], `retired brand values remain: ${matches.join(', ')}`);
});

test('mobile layout keeps the question and answers before story or evidence content', () => {
    assert.doesNotMatch(
        STYLE_SOURCE,
        /(?:story|evidence)[^{}]*\{[^{}]*\border\s*:\s*-\s*\d+/i,
        'mobile styles must not move story/evidence content ahead of the question'
    );

    const quizStart = APP_SOURCE.search(/<(?:div|section)\b[^>]*\bid=["']quizScreen["']/i);
    const resultStart = APP_SOURCE.search(/<(?:div|section)\b[^>]*\bid=["']resultScreen["']/i);
    assert.ok(quizStart >= 0 && resultStart > quizStart, 'quiz and result screens are required');
    const quizMarkup = APP_SOURCE.slice(quizStart, resultStart);
    const questionIndex = quizMarkup.search(/\bid=["']questionText["']/i);
    const answerIndex = quizMarkup.search(/\bdata-answer=["'](?:yes|no)["']/i);
    const evidenceIndex = quizMarkup.search(
        /(?:id|class)=["'][^"']*(?:story|evidence)[^"']*["']/i
    );

    assert.ok(questionIndex >= 0, 'quiz question markup is required');
    assert.ok(answerIndex >= 0, 'quiz answer controls are required');
    assert.ok(evidenceIndex >= 0, 'quiz story/evidence markup is required');
    assert.ok(questionIndex < evidenceIndex, 'question must precede story/evidence in the DOM');
    assert.ok(answerIndex < evidenceIndex, 'answers must precede story/evidence in the DOM');
});

test('question layout keeps the visual scene visible and removes the redundant signal waveform', () => {
    const quizStart = APP_SOURCE.search(/<(?:div|section)\b[^>]*\bid=["']quizScreen["']/i);
    const resultStart = APP_SOURCE.search(/<(?:div|section)\b[^>]*\bid=["']resultScreen["']/i);
    assert.ok(quizStart >= 0 && resultStart > quizStart, 'quiz and result screens are required');
    const quizMarkup = APP_SOURCE.slice(quizStart, resultStart);

    assert.match(quizMarkup, /id=["']signalSceneFrame["']/i);
    assert.match(quizMarkup, /id=["']signalScene["']/i);
    assert.doesNotMatch(quizMarkup, /id=["']waveform["']/i);
    assert.doesNotMatch(
        STYLE_SOURCE,
        /\.signal-scene\s*\{[^}]*\bdisplay\s*:\s*none/i,
        'the question image must remain visible'
    );
    assert.match(
        STYLE_SOURCE,
        /#signalSceneFrame\s+figcaption\s*\{[^}]*\bdisplay\s*:\s*none/i,
        'the redundant question-image caption must stay hidden'
    );
    assert.match(
        STYLE_SOURCE,
        /\.signal-image-wrap\s*\{[^}]*\baspect-ratio\s*:\s*4\s*\/\s*3/i,
        'signal scenes must retain their original 4:3 ratio'
    );
    assert.doesNotMatch(
        STYLE_SOURCE,
        /#signalSceneFrame\s+\.signal-image-wrap\s*\{[^}]*\baspect-ratio\s*:/i,
        'the question layout must not override the original scene ratio'
    );
});

test('Dead Signal terminal chrome and signal scene elements are present', () => {
    assert.match(APP_SOURCE, /DEAD SIGNAL DOS/i, 'terminal chrome must name the Dead Signal system');
    assert.match(
        APP_SOURCE,
        /(?:id|class)=["'][^"']*terminal[^"']*["']/i,
        'terminal chrome needs a stable semantic hook'
    );
    assert.match(APP_SOURCE, /(?:PORT|LINK|MEM)\s*:/i, 'terminal metadata must be visible');
    assert.match(
        APP_SOURCE,
        /(?:id|class)=["'][^"']*(?:signal[-_]?scene|scene[-_]?frame|dead[-_]?signal)[^"']*["']/i,
        'a dedicated signal scene element is required'
    );
    assert.match(STYLE_SOURCE, /image-rendering\s*:\s*pixelated/i);
    assert.match(APP_SOURCE, /\bdecoding=["']async["']/i);
});

test('the signal scene publishes an accessible loading/error status contract', () => {
    const rootMatch = APP_SOURCE.match(/<main\b[^>]*\bid=["']appRoot["'][^>]*>/i);
    assert.ok(rootMatch, 'appRoot main element is required');
    for (const attribute of ['data-category', 'data-scene', 'data-scene-src', 'data-scene-status']) {
        assert.match(rootMatch[0], new RegExp(`\\b${attribute}\\s*=`), `${attribute} must be published on appRoot`);
    }

    const sceneStatusTag = APP_SOURCE.match(
        /<[a-z][^>]*(?:id|class)=["'][^"']*(?:scene[-_]?status|signal[-_]?status|scene[-_]?readout|signal[-_]?readout)[^"']*["'][^>]*>/i
    );
    assert.ok(sceneStatusTag, 'a dedicated scene status element is required');
    assert.match(sceneStatusTag[0], /\brole=["']status["']/i);
    assert.match(sceneStatusTag[0], /\baria-live=["']polite["']/i);

    const sceneImageTag = APP_SOURCE.match(
        /<img\b[^>]*(?:id|class)=["'][^"']*(?:signal[-_]?scene|scene[-_]?frame|dead[-_]?signal)[^"']*["'][^>]*>/i
    );
    assert.ok(sceneImageTag, 'the signal scene must be an identifiable image');
    const altMatch = sceneImageTag[0].match(/\balt=["']([^"']+)["']/i);
    assert.ok(altMatch?.[1].trim(), 'the signal scene image needs meaningful alt text');
    assert.match(sceneImageTag[0], /\bdecoding=["']async["']/i);
});

test('quiz rendering and preloading share the same assigned scene variant', () => {
    assert.match(
        APP_SOURCE,
        /renderScene\(question\.categoryId,\s*state\.sceneAssignments\[state\.currentQuestionIndex\]\)/,
        'the current question must render its preassigned scene'
    );
    assert.match(
        APP_SOURCE,
        /const nextScene = state\.sceneAssignments\[state\.currentQuestionIndex \+ 1\]/,
        'preloading must read the next preassigned scene'
    );
    assert.match(APP_SOURCE, /preloadImage\.src = nextScene\.src/);
});

test('genre predictor declares random mode and renders percentage values', () => {
    const rootMatch = APP_SOURCE.match(/<main\b[^>]*\bid=["']appRoot["'][^>]*>/i);
    assert.ok(rootMatch);
    assert.match(rootMatch[0], /\bdata-predictor-category\s*=/i);
    assert.match(rootMatch[0], /\bdata-predictor-percent\s*=/i);
    assert.match(APP_SOURCE, /id=["']genrePredictor["'][^>]*\bdata-mode=["']random["']/i);
    assert.match(APP_SOURCE, /genre-bar-score[^\n]*\$\{entry\.percentage\}%/i);
});

test('final Collider dashboard is fabricated percentage output with an explicit winner', () => {
    const rootMatch = APP_SOURCE.match(/<main\b[^>]*\bid=["']appRoot["'][^>]*>/i);
    assert.ok(rootMatch);
    assert.match(rootMatch[0], /\bdata-result-signal-percent\s*=/i);
    assert.match(rootMatch[0], /\bdata-analysis-layout=["']collider["']/i);
    assert.match(rootMatch[0], /\bdata-analysis-mode=["']fabricated["']/i);
    assert.match(
        APP_SOURCE,
        /id=["']resultsDashboard["'][^>]*\bdata-analysis-layout=["']collider["'][^>]*\bdata-mode=["']fabricated["']/i
    );
    for (const id of [
        'metricStrip',
        'collisionPlot',
        'colliderLegend',
        'posteriorList',
        'regressionPlot',
        'coefficientBody',
        'recalibrateButton'
    ]) {
        assert.match(APP_SOURCE, new RegExp(`id=["']${id}["']`, 'i'), `${id} is required`);
    }
    const rendererMatch = APP_SOURCE.match(
        /function renderPosteriorCrossSection\([\s\S]*?\n\s*function renderNarrativeRegression\(/i
    );
    assert.ok(rendererMatch, 'the Collider posterior renderer must be present');
    assert.doesNotMatch(rendererMatch[0], /state\.scores/);
    assert.match(rendererMatch[0], /data-percent=["']\$\{percentage\}["']/);
    assert.match(rendererMatch[0], /data-winner=["']\$\{isWinner\}["']/);
    assert.match(rendererMatch[0], /posterior-value[^\n]*\$\{percentage\}%/);
    assert.match(APP_SOURCE, /id=["']coefficientHeading["'][^>]*>Coefficients</i);
    assert.doesNotMatch(APP_SOURCE, />\s*Fabricated Coefficients\s*</i);
});

test('landing intro preserves the complete original copy', () => {
    const introMatch = APP_SOURCE.match(
        /<div\b[^>]*\bid=["']introCopy["'][^>]*>([\s\S]*?)<\/div>/i
    );
    assert.ok(introMatch, 'the complete introduction needs a stable markup hook');

    const actualCopy = introMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const expectedCopy = [
        'Are you living your own story?',
        'Ever get the nagging feeling that your life is a little too structured? That the same things happen to you at the same time, every single day? That somewhere, somehow, someone might be watching - or worse, writing - what happens next?',
        "Two movies dared to ask a wild question: what if you weren't the author of your own life? What if you were just a character - in someone's novel, someone's screenplay, or maybe even someone's game - completely unaware of it?",
        "Before you dismiss that idea... take this quiz first. We'll ask you a few questions about how you see yourself, how you move through the world, and how you handle the unexpected. Your answers might reveal something surprising about the kind of story you're actually living in.",
        'Are you the hero? A side character? Or maybe... an NPC?'
    ].join(' ');

    assert.equal(actualCopy, expectedCopy);
});
