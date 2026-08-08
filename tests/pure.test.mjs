import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const APP_PATH = path.resolve(import.meta.dirname, '..', 'index.html');
const APP_SOURCE = fs.readFileSync(APP_PATH, 'utf8');

function loadPureHelpers() {
    const match = APP_SOURCE.match(
        /\/\* pure-helpers-start \*\/([\s\S]*?)\/\* pure-helpers-end \*\//
    );
    assert.ok(match, 'index.html must expose a pure helper block for headless checks');

    const sandbox = {};
    vm.runInNewContext(
        `${match[1]}\nthis.helpers = {\n` +
        'shuffle, selectQuestionsFromModel, calculateRealityIntegrity, ' +
        'determineWinner, validateModel, buildShareText\n};',
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
            .map(id => [id, { name: `Category ${id}`, result: `Result ${id}` }])
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
        'data-result-category'
    ]) {
        assert.match(root, new RegExp(`\\b${attribute}\\s*=`), `${attribute} is required`);
    }

    assert.match(APP_SOURCE, /id="progressTimeline"[^>]*role="progressbar"/i);
    assert.match(APP_SOURCE, /data-answer="yes"/i);
    assert.match(APP_SOURCE, /data-answer="no"/i);
    assert.match(APP_SOURCE, /id="appStatus"[^>]*role="status"[^>]*aria-live="polite"/i);
});
