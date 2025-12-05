// ========================================
// GAME DATA - Categories and Questions
// ========================================

const categories = [
    {
        id: 1,
        name: "The Destiny / Fantasy Hero",
        result: "You are the Chosen One. Stop ignoring the old man in the tavern; he has a quest for you. Also, check your attic for legendary swords."
    },
    {
        id: 2,
        name: "Young Adult Dystopian Hero",
        result: "You are the protagonist of a YA Dystopian novel. You're likely wearing combat boots and are about to overthrow a government using only angst and a bow and arrow."
    },
    {
        id: 3,
        name: "The Anime / Manga Protagonist",
        result: "You are a Shonen Protagonist. Your power level is rising. If you start glowing or screaming for more than 30 seconds, please move to an open field to avoid property damage."
    },
    {
        id: 4,
        name: "Main Character Energy (Slice of Life)",
        result: "You have Main Character Energy. Your life is a slice-of-life anime where everything feels intentional, cozy, and suspiciously well-lit. Enjoy your perfectly timed character development arcs."
    },
    {
        id: 5,
        name: "The Superhero / Comic Book Lead",
        result: "You are a Superhero. Please stop disappearing during emergencies—it's getting suspicious. Also, consider upgrading from that flimsy mask; everyone knows it's you."
    },
    {
        id: 6,
        name: "The Sitcom Character",
        result: "You are in a Sitcom. Your problems are ridiculous, your apartment is unrealistically nice, and everything resets by next week. Embrace the laugh track of life."
    },
    {
        id: 7,
        name: "Horror Movie Survivor (or Victim)",
        result: "You are in a Horror Movie. Please stop investigating creepy noises alone. Seriously. We're begging you. Also, check your lease—that rent was suspiciously cheap for a reason."
    },
    {
        id: 8,
        name: "The Mystery / Detective Protagonist",
        result: "You are a Detective. You see clues where others see trash. You probably look great in a trench coat, but your personal life is likely a shambles."
    },
    {
        id: 9,
        name: "The Romantic Comedy Lead",
        result: "You are in a Rom-Com. That clumsiness is charming, not dangerous. Prepare for a misunderstanding at the 60-minute mark, followed by a sprint through an airport."
    },
    {
        id: 10,
        name: "The Tarantino Character",
        result: "You are in a Tarantino movie. Your life is cool, violent, and non-linear. Enjoy the witty dialogue, but watch out—statistically, you might not make it to the credits."
    },
    {
        id: 11,
        name: "The Spielberg Hero",
        result: "You are in a Spielberg Adventure. Look at the horizon with awe. Something magical is coming, and it's going to make grown men cry."
    },
    {
        id: 12,
        name: "The Lucas Space Opera",
        result: "You are in a Space Opera Myth. You have a grand destiny, daddy issues, and a high probability of losing a hand. May the Force be with you."
    },
    {
        id: 13,
        name: "The Coppola Family Epic",
        result: "You are in a Mafia Family Drama. It's strictly business. Don't go fishing, don't accept favors on your daughter's wedding day, and stay away from the cannoli."
    }
];

const questions = [
    // Category 1: The Destiny / Fantasy Hero
    { text: "Does anyone around you keep muttering things like \"the prophecy is fulfilled\" when you enter a room?", categoryId: 1 },
    { text: "Have you recently discovered you can read an ancient language despite never studying it?", categoryId: 1 },
    { text: "Did a talking animal, tree, or sword give you life advice in the last 48 hours?", categoryId: 1 },
    { text: "Is there a local Dark Lord whose Pinterest board seems oddly focused on you?", categoryId: 1 },
    { text: "Have you learned that an object you've had since childhood is actually \"one of the legendary relics\"?", categoryId: 1 },
    { text: "Do elderly villagers stare at you, whisper, and then refuse to explain what they know?", categoryId: 1 },
    { text: "Has a mentor figure died immediately after giving you one really important speech?", categoryId: 1 },
    { text: "Do maps in your world contain ominous labels like \"Here Be Dragons\" exactly where you're heading?", categoryId: 1 },
    { text: "Are you inexplicably good at swordfighting / magic / riding dragons despite zero training last week?", categoryId: 1 },
    { text: "Has anyone told you that \"your power is unstable\" but no one will give you a user manual?", categoryId: 1 },

    // Category 2: Young Adult Dystopian Hero
    { text: "Does your government assign people jobs based on a single test taken at age 16?", categoryId: 2 },
    { text: "Is society divided into color-coded or trait-based factions that definitely won't cause civil war?", categoryId: 2 },
    { text: "Have you noticed your world has way too many fences, walls, or domes for comfort?", categoryId: 2 },
    { text: "Are you forced to wear the same gray or beige outfit every day, except when you're being rebellious?", categoryId: 2 },
    { text: "Is your love interest on the opposite side of the regime, yet weirdly bad at arresting you?", categoryId: 2 },
    { text: "Have you discovered that the \"outside world\" is not what everyone claims it is?", categoryId: 2 },
    { text: "Does everyone over 40 seem suspicious, complicit, or conveniently dead?", categoryId: 2 },
    { text: "Is there a Hunger Games-style event that everyone pretends is normal?", categoryId: 2 },
    { text: "Do you have a unique trait that makes you \"dangerous to the system\"?", categoryId: 2 },
    { text: "Are you part of a love triangle where both options are equally emotionally unavailable?", categoryId: 2 },

    // Category 3: The Anime / Manga Protagonist
    { text: "Do strangers frequently comment on your \"incredible potential\" despite overwhelming evidence to the contrary?", categoryId: 3 },
    { text: "Did your tragic childhood only get mentioned halfway through season two?", categoryId: 3 },
    { text: "Does your power level dramatically increase whenever you think about friendship?", categoryId: 3 },
    { text: "Has a mysterious rival appeared whose sole purpose is to glare at you from rooftops?", categoryId: 3 },
    { text: "Do you regularly survive injuries that should require at least three funerals?", categoryId: 3 },
    { text: "Is there a tournament arc in your life where absolutely everything must be decided by a flashy battle?", categoryId: 3 },
    { text: "Do enemies politely wait for you to finish long speeches before attacking?", categoryId: 3 },
    { text: "Have you ever unlocked a new form/state by screaming for an uncomfortably long time?", categoryId: 3 },
    { text: "Did you die and wake up in another world with a menu screen and inventory?", categoryId: 3 },
    { text: "Is there a mascot creature nearby whose main abilities are being adorable and selling merch?", categoryId: 3 },

    // Category 4: Main Character Energy (Slice of Life)
    { text: "Has anyone ever told you, \"You always learn the lesson right before the credits roll\"?", categoryId: 4 },
    { text: "Do you bump into the same three strangers in wildly different parts of town for no reason?", categoryId: 4 },
    { text: "Does your alarm clock ring exactly when something dramatic happens?", categoryId: 4 },
    { text: "Is your local coffee shop staff weirdly invested in your love life?", categoryId: 4 },
    { text: "Does your internal monologue sound like it's narrated by someone with a podcast?", categoryId: 4 },
    { text: "Do heartfelt conversations conveniently happen during sunsets with perfect lighting?", categoryId: 4 },
    { text: "Does every big life event happen on weekends or evenings—never during boring office hours?", categoryId: 4 },
    { text: "When you change your hairstyle, does everyone react like it's a season premiere?", categoryId: 4 },
    { text: "Do you often say \"I have a bad feeling about this\" right before something important happens?", categoryId: 4 },
    { text: "Does your life seem to have \"bottle episodes\" where everything happens in one location?", categoryId: 4 },

    // Category 5: The Superhero / Comic Book Lead
    { text: "Do you have a secret second wardrobe made mostly of spandex, leather, or capes?", categoryId: 5 },
    { text: "Did a freak accident (lab, spider, radiation, alien artifact) give you abilities instead of a lawsuit?", categoryId: 5 },
    { text: "Is your city's crime rate mysteriously correlated with your availability?", categoryId: 5 },
    { text: "Does no one recognize you when you put on a small mask or different glasses?", categoryId: 5 },
    { text: "Is there an arch-nemesis who somehow escapes prison every other week?", categoryId: 5 },
    { text: "Does your boss keep saying \"Where were you during the attack?!\" while you're bandaged up?", categoryId: 5 },
    { text: "Have you dramatically whispered \"With great power comes great responsibility\" at least once?", categoryId: 5 },
    { text: "Is your romantic relationship constantly ruined by you having to \"step out for a minute\"?", categoryId: 5 },
    { text: "Do you have a secret hideout that's way cooler than your actual apartment?", categoryId: 5 },
    { text: "Does dramatic lighting and fog appear whenever you make an entrance?", categoryId: 5 },

    // Category 6: The Sitcom Character
    { text: "Do people around you pause and stare into the distance as if waiting for laughter?", categoryId: 6 },
    { text: "Does every problem in your life escalate absurdly and then reset by next week?", categoryId: 6 },
    { text: "Do you live in an apartment far nicer than your salary can realistically explain?", categoryId: 6 },
    { text: "Is your neighbor/friend always dropping by without knocking, yet no one calls the police?", categoryId: 6 },
    { text: "Do minor misunderstandings spiral into chaos because no one will explain a simple sentence?", categoryId: 6 },
    { text: "Have you pretended to be someone's partner/boss/parent to get out of an awkward situation?", categoryId: 6 },
    { text: "Does your workplace have exactly 5–8 recurring characters and nobody else?", categoryId: 6 },
    { text: "Do your exes or old classmates reappear exactly when the episode needs drama?", categoryId: 6 },
    { text: "Have you ever gotten locked in a room/elevator and had to resolve emotional baggage to escape?", categoryId: 6 },
    { text: "Does your friend group meet at the same spot every single day without fail?", categoryId: 6 },

    // Category 7: The Horror Movie Survivor (or Victim)
    { text: "Do you currently live near a cemetery, old asylum, or house described as \"having history\"?", categoryId: 7 },
    { text: "Have you heard a noise in the basement and thought, \"I should investigate alone, unarmed\"?", categoryId: 7 },
    { text: "Does your town have a legend everyone knows but no one takes seriously until it's too late?", categoryId: 7 },
    { text: "Has someone suggested splitting up, and you agreed like that was a good idea?", categoryId: 7 },
    { text: "Do children in your area quietly sing creepy rhymes about local tragedies?", categoryId: 7 },
    { text: "Has a mirror, TV, or doll ever stared back at you in a way that felt… too intentional?", categoryId: 7 },
    { text: "Does the weather dramatically shift to thunder and lightning whenever secrets are revealed?", categoryId: 7 },
    { text: "Did you recently move into a place where the rent is suspiciously cheap?", categoryId: 7 },
    { text: "Do people keep warning you to \"leave while you still can\" but refuse to elaborate?", categoryId: 7 },
    { text: "Has your phone, car, or only escape route failed at the worst possible moment?", categoryId: 7 },

    // Category 8: The Mystery / Detective Protagonist
    { text: "Do you routinely notice tiny details that everyone else somehow missed?", categoryId: 8 },
    { text: "Have you ever dramatically announced the solution to a problem in front of a gathered crowd?", categoryId: 8 },
    { text: "Do you get invited to isolated mansions, trains, or islands right before a crime happens?", categoryId: 8 },
    { text: "Has someone said, \"You're the only one who can figure this out\" despite many qualified professionals?", categoryId: 8 },
    { text: "Does your friend group include at least one comic-relief sidekick who keeps almost dying?", categoryId: 8 },
    { text: "Do you keep a bulletin board full of photos and red string, and call it \"thinking\"?", categoryId: 8 },
    { text: "Are you haunted by one unsolved case that you bring up at every social gathering?", categoryId: 8 },
    { text: "Does your intuition work suspiciously well, like you have access to the script?", categoryId: 8 },
    { text: "Do people confess to you unprompted after you stare at them silently for 10 seconds?", categoryId: 8 },
    { text: "Is your apartment 90% case files and 10% questionable living conditions?", categoryId: 8 },

    // Category 9: The Romantic Comedy Lead
    { text: "Have you literally collided with a stranger while carrying coffee, groceries, or paperwork?", categoryId: 9 },
    { text: "Is there someone you \"can't stand\" but also think about constantly for no good reason?", categoryId: 9 },
    { text: "Does terrible weather appear exactly when you need a dramatic confession scene?", categoryId: 9 },
    { text: "Have you had to choose between a stable, kind person and a chaotic, charming disaster?", categoryId: 9 },
    { text: "Do you make big life decisions based on overhearing half a conversation?", categoryId: 9 },
    { text: "Has your best friend ever said, \"The person you're looking for has been right here all along\"?", categoryId: 9 },
    { text: "Do grand public gestures of affection keep happening around you—and somehow work out?", categoryId: 9 },
    { text: "Have you ever run through an airport or train station to stop someone from leaving?", categoryId: 9 },
    { text: "Does every major romantic moment happen with a perfectly curated indie soundtrack?", categoryId: 9 },
    { text: "Have you fake-dated someone for a wedding/event and caught real feelings?", categoryId: 9 },

    // Category 10: The Tarantino Universe
    { text: "Do you frequently have long, philosophical conversations about trivial topics (like burgers or tipping) right before something violent happens?", categoryId: 10 },
    { text: "Is the soundtrack of your life made of obscure but incredibly cool retro tracks that start playing at oddly tense moments?", categoryId: 10 },
    { text: "Has anyone ever delivered a calm, five-minute speech while clearly holding a weapon?", categoryId: 10 },
    { text: "Do arguments in your world escalate from \"casual banter\" to \"life-threatening situation\" instantly?", categoryId: 10 },
    { text: "Does your story keep jumping back and forth in time, revealing that actually you already saw this scene… from a different angle?", categoryId: 10 },
    { text: "Have you recently opened a briefcase, seen a mysterious glowing light, and nobody will tell you what it is?", categoryId: 10 },
    { text: "Have you ever danced in a diner, bar, or living room for no clear reason, but it somehow felt extremely important to the plot?", categoryId: 10 },
    { text: "Does everyone talk like they're trying to win a \"Coolest Dialogue\" competition?", categoryId: 10 },
    { text: "Are there long stretches of time where nothing happens, then suddenly everything happens at once?", categoryId: 10 },
    { text: "Do you regularly reference obscure pop culture while doing something extremely illegal?", categoryId: 10 },

    // Category 11: The Spielberg Adventure
    { text: "Are you or one of your closest companions a child who knows way more than the adults about what's going on?", categoryId: 11 },
    { text: "Do ordinary suburban streets around you frequently become scenes of extraordinary events (UFOs, dinosaurs)?", categoryId: 11 },
    { text: "Have you recently touched something otherworldly while soft, emotional music played in the background?", categoryId: 11 },
    { text: "Do your most important moments happen at sunset with a suspiciously perfect glowing sky?", categoryId: 11 },
    { text: "Is there a gentle, misunderstood creature/being that everyone fears except you and your small group of friends?", categoryId: 11 },
    { text: "Do bicycles, walkie-talkies, and improvised gadgets play a suspiciously large role in your survival?", categoryId: 11 },
    { text: "Have you looked up into the sky in awe at something huge and mysterious while the camera zooms in on your face?", categoryId: 11 },
    { text: "Does John Williams music seem to play whenever you do literally anything?", categoryId: 11 },
    { text: "Are you part of a ragtag group of misfits who somehow save the day?", categoryId: 11 },
    { text: "Do government agents keep showing up and refusing to explain what's happening?", categoryId: 11 },

    // Category 12: The Lucas Space Opera
    { text: "Have you ever learned that the main villain is secretly related to you in a very inconvenient way?", categoryId: 12 },
    { text: "Does your world contain a giant authoritarian empire, a scrappy rebellion, and a moon-sized superweapon?", categoryId: 12 },
    { text: "Did an old, cryptic mentor tell you to \"trust your feelings\" instead of giving clear instructions?", categoryId: 12 },
    { text: "Do people around you casually use mystical energy, but insist it's also kind of science?", categoryId: 12 },
    { text: "Is there a noisy alien bar/cantina where everyone seems to be doing illegal business in the open?", categoryId: 12 },
    { text: "Have you piloted, or wanted to pilot, a ridiculously unsafe vehicle through impossible obstacles at high speed?", categoryId: 12 },
    { text: "Do you have a bad feeling about things so often it might as well be your catchphrase?", categoryId: 12 },
    { text: "Is your family tree more of a family tangled web of galactic drama?", categoryId: 12 },
    { text: "Does your weapon make a distinctive sound that merchandisers dream about?", categoryId: 12 },
    { text: "Have you been told there's a \"disturbance\" in some mystical force lately?", categoryId: 12 },

    // Category 13: The Coppola Family Epic
    { text: "Is your life heavily influenced by a powerful family, clan, or organization where loyalty matters more than the law?", categoryId: 13 },
    { text: "Do major decisions get made around large dining tables, in hushed tones, while everyone pretends nothing is wrong?", categoryId: 13 },
    { text: "Have you ever been told, \"It's not personal, it's strictly business\" right before something very personal happened?", categoryId: 13 },
    { text: "Do you find yourself slowly becoming more like a parent or elder you swore you'd never resemble?", categoryId: 13 },
    { text: "Do weddings, baptisms, or other sacred ceremonies in your world suspiciously coincide with acts of extreme betrayal?", categoryId: 13 },
    { text: "Does rain, dim light, or church organs play whenever major moral choices are made?", categoryId: 13 },
    { text: "Are deals in your world always described as \"offers you can't refuse,\" yet you really wish you could?", categoryId: 13 },
    { text: "Do you kiss people on both cheeks while secretly planning their demise?", categoryId: 13 },
    { text: "Is there a family business that's definitely not what it claims to be?", categoryId: 13 },
    { text: "Have you ever said \"I'm out\" but everyone knows you're never really out?", categoryId: 13 }
];

const defaultResult = {
    name: "Regular Miserable Person",
    result: "You are just a regular miserable person in real life. No prophecies, no epic soundtrack, and no cinematic lighting. Just emails, laundry, mild back pain, and the crushing weight of reality. Sorry."
};

// ========================================
// GAME STATE
// ========================================

let gameState = {
    activeCategories: [],
    selectedQuestions: [],
    currentQuestionIndex: 0,
    scores: {},
    questionOrder: [] // Track the order questions were shown for tie-breaking
};

// ========================================
// GAME LOGIC - Question Selection Algorithm
// ========================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function selectQuestions() {
    // Step 1: Select 3 random categories
    const categoryIds = categories.map(c => c.id);
    const shuffledCategories = shuffleArray(categoryIds);
    const activeCategories = shuffledCategories.slice(0, 3);

    // Step 2: Select 3 questions from each active category
    const selectedQuestions = [];
    const usedQuestionIndices = new Set();

    activeCategories.forEach(categoryId => {
        const categoryQuestions = questions
            .map((q, index) => ({ ...q, originalIndex: index }))
            .filter(q => q.categoryId === categoryId);

        const shuffledCategoryQuestions = shuffleArray(categoryQuestions);
        const picked = shuffledCategoryQuestions.slice(0, 3);

        picked.forEach(q => {
            selectedQuestions.push(q);
            usedQuestionIndices.add(q.originalIndex);
        });
    });

    // Step 3: Add 1 extra question from a random active category
    const randomCategory = activeCategories[Math.floor(Math.random() * activeCategories.length)];
    const remainingQuestions = questions
        .map((q, index) => ({ ...q, originalIndex: index }))
        .filter(q => q.categoryId === randomCategory && !usedQuestionIndices.has(q.originalIndex));

    if (remainingQuestions.length > 0) {
        const extraQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
        selectedQuestions.push(extraQuestion);
    }

    // Step 4: Shuffle the final question set
    const finalQuestions = shuffleArray(selectedQuestions);

    return {
        activeCategories,
        selectedQuestions: finalQuestions
    };
}

// ========================================
// GAME LOGIC - Scoring and Results
// ========================================

function initializeScores() {
    const scores = {};
    categories.forEach(category => {
        scores[category.id] = 0;
    });
    return scores;
}

function recordAnswer(answer) {
    if (answer === 'yes') {
        const currentQuestion = gameState.selectedQuestions[gameState.currentQuestionIndex];
        gameState.scores[currentQuestion.categoryId]++;

        // Track the order for tie-breaking (store category ID and question index)
        gameState.questionOrder.push({
            categoryId: currentQuestion.categoryId,
            questionIndex: gameState.currentQuestionIndex
        });
    }
}

function determineResult() {
    // Find the maximum score
    const maxScore = Math.max(...Object.values(gameState.scores));

    // Check for "Regular Miserable Person" threshold
    if (maxScore <= 1) {
        return defaultResult;
    }

    // Find all categories with max score
    const winningCategoryIds = Object.keys(gameState.scores)
        .filter(id => gameState.scores[id] === maxScore)
        .map(id => parseInt(id));

    // If only one winner, return it
    if (winningCategoryIds.length === 1) {
        return categories.find(c => c.id === winningCategoryIds[0]);
    }

    // Tie-breaker: find which winning category appeared last in question order
    let lastAppearance = -1;
    let winningCategory = null;

    for (let i = gameState.questionOrder.length - 1; i >= 0; i--) {
        const { categoryId } = gameState.questionOrder[i];
        if (winningCategoryIds.includes(categoryId) && i > lastAppearance) {
            lastAppearance = i;
            winningCategory = categoryId;
            break; // We found the last appearance
        }
    }

    return categories.find(c => c.id === winningCategory);
}

// ========================================
// UI MANAGEMENT
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function updateProgress() {
    const progress = ((gameState.currentQuestionIndex) / gameState.selectedQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent =
        `Question ${gameState.currentQuestionIndex + 1} of ${gameState.selectedQuestions.length}`;
}

function displayQuestion() {
    const question = gameState.selectedQuestions[gameState.currentQuestionIndex];
    document.getElementById('question-text').textContent = question.text;
    updateProgress();
}

function displayResult() {
    const result = determineResult();
    document.getElementById('result-title').textContent = result.name;
    document.getElementById('result-text').textContent = result.result;
    showScreen('result-screen');
}

// ========================================
// GAME FLOW CONTROL
// ========================================

function startGame() {
    // Reset and initialize game state
    const { activeCategories, selectedQuestions } = selectQuestions();
    gameState = {
        activeCategories,
        selectedQuestions,
        currentQuestionIndex: 0,
        scores: initializeScores(),
        questionOrder: []
    };

    // Show quiz screen and display first question
    showScreen('quiz-screen');
    displayQuestion();
}

function handleAnswer(answer) {
    // Record the answer
    recordAnswer(answer);

    // Move to next question or show results
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < gameState.selectedQuestions.length) {
        displayQuestion();
    } else {
        displayResult();
    }
}

function shareResult() {
    const result = determineResult();
    const shareText = `I just found out: ${result.name}!\n\nTry "Am I in a Story? – The Narrative Diagnostic" and discover your narrative archetype!`;

    if (navigator.share) {
        navigator.share({
            title: 'Am I in a Story?',
            text: shareText
        }).catch(err => console.log('Share failed', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Result copied to clipboard!');
        }).catch(() => {
            alert('Unable to share. Try again!');
        });
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Landing screen
    document.getElementById('start-btn').addEventListener('click', startGame);

    // Quiz screen
    document.getElementById('yes-btn').addEventListener('click', () => handleAnswer('yes'));
    document.getElementById('no-btn').addEventListener('click', () => handleAnswer('no'));

    // Result screen
    document.getElementById('play-again-btn').addEventListener('click', () => {
        showScreen('landing-screen');
    });
    document.getElementById('share-btn').addEventListener('click', shareResult);
});
