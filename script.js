// ============================================
// CyberMinute2 - Refactored Game Logic
// All original questions and rules preserved
// Enhanced with new Timed auto-advance + Study mode flows
// ============================================

const questions = [
    // Email Phishing
    { question: "Phishing emails often contain spelling and grammar mistakes.", answer: true, category: "Email Phishing" },
    { question: "It's safe to click on links in emails from unknown senders if the email looks professional.", answer: false, category: "Email Phishing" },
    { question: "Phishing emails can pretend to come from a trusted company.", answer: true, category: "Email Phishing" },
    { question: "You should always verify the sender's email address before replying to an email.", answer: true, category: "Email Phishing" },
    { question: "Phishing emails never include attachments.", answer: false, category: "Email Phishing" },
    { question: "Hovering over a link in an email can reveal if it's suspicious.", answer: true, category: "Email Phishing" },
    { question: "Phishing only happens through email, not text messages.", answer: false, category: "Email Phishing" },
    { question: "All emails from your bank are safe to trust without checking.", answer: false, category: "Email Phishing" },
    { question: "Phishing emails often try to create urgency to make you act without thinking.", answer: true, category: "Email Phishing" },
    { question: "The sender name displayed in your inbox is always the real sender.", answer: false, category: "Email Phishing" },
    { question: "Hackers can create fake websites that look almost identical to legitimate ones.", answer: true, category: "Email Phishing" },
    { question: "Verifying suspicious requests by calling the company using a publicly known phone number is a good practice.", answer: true, category: "Email Phishing" },
    { question: "Phishing attempts can include fake security alerts from your IT department.", answer: true, category: "Email Phishing" },
    { question: "It's safe to click links in emails if they match the company's branding perfectly.", answer: false, category: "Email Phishing" },
    { question: "Business email compromise is a sophisticated form of phishing attack.", answer: true, category: "Email Phishing" },
    { question: "You should never enter login credentials on a website reached via an email link.", answer: true, category: "Email Phishing" },

    // Password Security
    { question: "Using the same password for multiple accounts increases the risk of a security breach.", answer: true, category: "Password Security" },
    { question: "It's okay to use the same password for all your work accounts if it's strong.", answer: false, category: "Password Security" },
    { question: "A strong password should include numbers, letters, and special characters.", answer: true, category: "Password Security" },
    { question: "Writing down passwords on paper is safer than reusing them.", answer: true, category: "Password Security" },
    { question: "Password managers can help you avoid reusing passwords.", answer: true, category: "Password Security" },
    { question: "Short passwords are just as secure as long ones if they're unique.", answer: false, category: "Password Security" },
    { question: "You should change your passwords regularly to stay secure.", answer: true, category: "Password Security" },
    { question: "Using the same password on multiple websites puts all those accounts at risk if one is breached.", answer: true, category: "Password Security" },
    { question: "Password managers help generate and store strong, unique passwords for each account.", answer: true, category: "Password Security" },
    { question: "It's acceptable to reuse passwords if you add a number at the end for each site.", answer: false, category: "Password Security" },
    { question: "A passphrase made of several random words is often more secure than a short complex password.", answer: true, category: "Password Security" },
    { question: "You should use the same password for low-risk sites like news websites.", answer: false, category: "Password Security" },
    { question: "Weak passwords can be guessed or cracked very quickly by hackers.", answer: true, category: "Password Security" },
    { question: "Multi-factor authentication can help protect your accounts even if your password is reused and stolen.", answer: true, category: "Password Security" },

    // Email Scams
    { question: "Emails asking for urgent action or threatening consequences are likely scams.", answer: true, category: "Email Scams" },
    { question: "If an email comes from a known contact, it's always safe to open attachments.", answer: false, category: "Email Scams" },
    { question: "Scammers can use fake email addresses that look real.", answer: true, category: "Email Scams" },
    { question: "Winning a prize in an email you didn't enter is usually a scam.", answer: true, category: "Email Scams" },
    { question: "Emails asking for your password are legitimate if they're from IT.", answer: false, category: "Email Scams" },
    { question: "You should report suspicious emails to your IT department.", answer: true, category: "Email Scams" },
    { question: "Email scams only target businesses, not individuals.", answer: false, category: "Email Scams" },
    { question: "Emails promising large sums of money for helping transfer funds are usually scams.", answer: true, category: "Email Scams" },
    { question: "Fake technical support emails claiming your computer has a virus are common scams.", answer: true, category: "Email Scams" },
    { question: "You should always double-check email addresses carefully, looking for subtle misspellings.", answer: true, category: "Email Scams" },
    { question: "Scammers may impersonate colleagues to request wire transfers or gift cards.", answer: true, category: "Email Scams" },
    { question: "If an email asks you to pay an unexpected invoice urgently, it could be fraudulent.", answer: true, category: "Email Scams" },
    { question: "Reporting scam emails helps protect others in your organization.", answer: true, category: "Email Scams" },
    { question: "Email scams can lead to financial loss or data theft for both companies and individuals.", answer: true, category: "Email Scams" },

    // Virus Prevention
    { question: "Installing antivirus software can help protect your computer from viruses.", answer: true, category: "Virus Prevention" },
    { question: "Downloading software from unofficial sources is safe if it's free.", answer: false, category: "Virus Prevention" },
    { question: "Updating your software regularly can prevent virus infections.", answer: true, category: "Virus Prevention" },
    { question: "Opening email attachments from unknown sources can infect your device.", answer: true, category: "Virus Prevention" },
    { question: "Viruses can only spread through email, not USB drives.", answer: false, category: "Virus Prevention" },
    { question: "Antivirus software guarantees 100% protection from all viruses.", answer: false, category: "Virus Prevention" },
    { question: "Clicking 'unsubscribe' on spam emails can stop viruses.", answer: false, category: "Virus Prevention" },
    { question: "Malware can be disguised as legitimate software updates or downloads.", answer: true, category: "Virus Prevention" },
    { question: "Visiting compromised websites can (rarely) automatically download malware to your computer.", answer: true, category: "Virus Prevention" },
    { question: "Keeping your operating system and applications updated is important for security.", answer: true, category: "Virus Prevention" },
    { question: "USB drives from unknown sources should never be plugged into work computers without scanning.", answer: true, category: "Virus Prevention" },
    { question: "Antivirus programs should be kept running and updated at all times.", answer: true, category: "Virus Prevention" },
    { question: "Opening PDFs or Word documents from unknown sources is completely safe.", answer: false, category: "Virus Prevention" },
    { question: "Using a firewall provides an additional layer of protection against viruses.", answer: true, category: "Virus Prevention" },

    // Ransomware
    { question: "If you suspect a ransomware attack, you should disconnect your device from the network.", answer: true, category: "Ransomware" },
    { question: "Paying the ransom is the best way to get your files back after a ransomware attack.", answer: false, category: "Ransomware" },
    { question: "Ransomware can lock your files and demand payment to unlock them.", answer: true, category: "Ransomware" },
    { question: "You should report a ransomware attack to your IT team immediately.", answer: true, category: "Ransomware" },
    { question: "Backups can help you recover from a ransomware attack without paying.", answer: true, category: "Ransomware" },
    { question: "Ransomware only affects personal computers, not company devices.", answer: false, category: "Ransomware" },
    { question: "Restarting your computer will remove ransomware.", answer: false, category: "Ransomware" },
    { question: "In a suspected ransomware incident, you should avoid using the infected device for any work.", answer: true, category: "Ransomware" },
    { question: "Ransomware attacks often spread to other computers on the same network.", answer: true, category: "Ransomware" },
    { question: "You should never pay the ransom demanded by attackers.", answer: true, category: "Ransomware" },
    { question: "Having recent, clean backups stored separately can help recover from ransomware.", answer: true, category: "Ransomware" },
    { question: "Ransomware can also steal your data before encrypting your files.", answer: true, category: "Ransomware" },
    { question: "Immediately notifying your supervisor or IT helpdesk is crucial during a ransomware attack.", answer: true, category: "Ransomware" },
];

// ============================================
// Study Mode Category System (from STUDY_MODE_CATEGORIES_PLAN.md)
// Single source of truth for filtering — future-proof for Supabase
// ============================================

const CATEGORIES = [
    { id: "Email Phishing",     label: "Phishing" },
    { id: "Password Security",  label: "Passwords" },
    { id: "Email Scams",        label: "Email Scams" },
    { id: "Virus Prevention",   label: "Viruses" },
    { id: "Ransomware",         label: "Ransomware" }
];

/**
 * Returns questions for Study mode.
 * category = null → all questions
 * This is the ONLY place that should know how to select study questions.
 * Future: When questions live in Supabase, replace the body of this function.
 */
function getStudyQuestions(category = null) {
    if (!category) {
        return [...questions];
    }
    return questions.filter(q => q.category === category);
}


// Game State
let currentQuestionIndex = 0;
let score = 0;
let questionsAnswered = 0;
let timer = 60;
let timerInterval = null;
let studyTimerInterval = null;
let studyStartTime = null;
let isStudyMode = false;
let currentStudyCategory = null;  // For displaying selected category on end screen
let highScore = localStorage.getItem('cyberMinuteHighScore') || 0;
let autoAdvanceTimeout = null;

// Leaderboard / Submission state
let sessionToken = null;
let quizStartTime = null;
let finalDuration = null;   // Captured exactly when the Timed quiz ends (frozen value)

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startButton = document.getElementById('start-button');
const studyButton = document.getElementById('study-button');
const mainMenuBtn = document.getElementById('main-menu-btn');
const endStudyButton = document.getElementById('end-study-button');
const menuButton = document.getElementById('menu-button');
const menuModal = document.getElementById('menu-confirm-modal');
const confirmGoBack = document.getElementById('confirm-go-back');
const confirmStay = document.getElementById('confirm-stay');

const questionEl = document.getElementById('question');
const questionCategoryEl = document.getElementById('question-category');
const trueButton = document.getElementById('true-button');
const falseButton = document.getElementById('false-button');
const feedbackEl = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const nextButton = document.getElementById('next-button');

const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const countdownEl = document.getElementById('countdown');
const countdownNumber = countdownEl.querySelector('.countdown-number');

const highScoreDisplay = document.getElementById('high-score-display');
const endHighScoreDisplay = document.getElementById('end-high-score-display');
const finalScoreEl = document.getElementById('final-score');

const submitScoreSection = document.getElementById('submit-score-section');
const playerNameInput = document.getElementById('player-name');
const submitScoreBtn = document.getElementById('submit-score-btn');

// Leaderboard elements
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');
const tabAll = document.getElementById('tab-all');
const tabToday = document.getElementById('tab-today');
const leaderboardContent = document.getElementById('leaderboard-content');

// Study Category Modal elements (Phase B)
const studyCategoryModal = document.getElementById('study-category-modal');
const closeStudyCategoryBtn = document.getElementById('close-study-category');
const studyAllBtn = document.getElementById('study-all-btn');
const categoryGrid = document.getElementById('category-grid');

const endCategoryEl = document.getElementById('end-category');

// Initialize
function init() {
    highScoreDisplay.textContent = highScore;
    endHighScoreDisplay.textContent = highScore;

    startButton.addEventListener('click', () => startGame(false));
    studyButton.addEventListener('click', showStudyCategoryModal);
    mainMenuBtn.addEventListener('click', goBackToMenu);
    endStudyButton.addEventListener('click', () => startGame(true));

    trueButton.addEventListener('click', () => handleAnswer(true));
    falseButton.addEventListener('click', () => handleAnswer(false));
    nextButton.addEventListener('click', nextQuestion);
    menuButton.addEventListener('click', showMenuConfirm);
    confirmGoBack.addEventListener('click', goBackToMenu);
    confirmStay.addEventListener('click', hideMenuConfirm);

    // Leaderboard submission
    if (submitScoreBtn) {
        submitScoreBtn.addEventListener('click', () => {
            const name = playerNameInput.value.trim();
            if (!name) {
                alert("Please enter your name");
                return;
            }
            if (name.length > 12) {
                alert("Name must be 12 characters or less");
                return;
            }
            if (!/^[A-Za-z' -]+$/.test(name)) {
                alert("Name can only contain letters, spaces, apostrophes (') and hyphens (-)");
                return;
            }
            submitScoreToLeaderboard(name);
        });
    }

    // Leaderboard
    if (leaderboardButton) {
        leaderboardButton.addEventListener('click', showLeaderboard);
    }
    if (closeLeaderboardBtn) {
        closeLeaderboardBtn.addEventListener('click', () => leaderboardModal.classList.add('hidden'));
    }
    if (tabAll) {
        tabAll.addEventListener('click', () => switchLeaderboardTab('all'));
    }
    if (tabToday) {
        tabToday.addEventListener('click', () => switchLeaderboardTab('today'));
    }
}

function startGame(studyMode) {
    isStudyMode = studyMode;

    // Reset category display state when starting a new game
    if (!studyMode) {
        currentStudyCategory = null;
    }

    // Support category filtering for Study mode (from STUDY_MODE_CATEGORIES_PLAN.md)
    if (isStudyMode && window._studyCategoryFilter) {
        currentQuestions = getStudyQuestions(window._studyCategoryFilter).sort(() => Math.random() - 0.5);
        window._studyCategoryFilter = null; // one-time use
    } else {
        currentQuestions = [...questions].sort(() => Math.random() - 0.5);
    }

    currentQuestionIndex = 0;
    score = 0;
    questionsAnswered = 0;
    timer = 60;

    // Clear any previous timers
    clearInterval(timerInterval);
    clearInterval(studyTimerInterval);
    clearTimeout(autoAdvanceTimeout);

    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Ensure high score box is visible (in case it was hidden from previous Study session)
    const endHighScoreBox = document.querySelector('#end-screen .high-score-box');
    if (endHighScoreBox) endHighScoreBox.style.display = '';

    scoreEl.textContent = score;
    feedbackEl.classList.add('hidden');
    if (questionCategoryEl) questionCategoryEl.classList.add('hidden');

    // Reset leaderboard submission state
    sessionToken = null;
    quizStartTime = null;

    // Reset study timer display if needed
    if (isStudyMode) {
        timerEl.textContent = '0:00';
        timerEl.style.color = 'var(--accent)';
        startStudyTimer();
        showQuestion();
    } else {
        // Timed mode: generate session token for leaderboard submission
        sessionToken = crypto.randomUUID();
        quizStartTime = Date.now();
        sessionStorage.setItem('cyberminute_session_token', sessionToken);

        timerEl.style.color = '';
        startCountdown();
    }
}

/**
 * Entry point for Study mode with optional category.
 * Sets the filter then calls startGame(true).
 * Used by the category picker modal (Phase B).
 */
function startStudyMode(category = null) {
    window._studyCategoryFilter = category;

    // Set nice display name for end screen
    if (category) {
        const cat = CATEGORIES.find(c => c.id === category);
        currentStudyCategory = cat ? cat.label : category;
    } else {
        currentStudyCategory = "All Categories";
    }

    startGame(true);
}

// ==================== STUDY MODE TIMER ====================
function startStudyTimer() {
    studyStartTime = Date.now();

    studyTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - studyStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// ==================== TIMED MODE ====================
function startCountdown() {
    countdownEl.classList.remove('hidden');
    let count = 3;
    countdownNumber.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.classList.add('hidden');
            startTimer();
            showQuestion();
        }
    }, 1000);
}

function startTimer() {
    timerEl.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timerEl.textContent = timer;

        if (timer <= 10) {
            timerEl.style.color = '#f87171';
        }

        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

// ==================== QUESTION DISPLAY ====================
function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const currentQ = currentQuestions[currentQuestionIndex];
    questionEl.textContent = currentQ.question;

    // Show category subnote only in Study mode (subtle / non-distracting)
    if (isStudyMode && questionCategoryEl && currentQ.category) {
        questionCategoryEl.textContent = currentQ.category;
        questionCategoryEl.classList.remove('hidden');
    } else if (questionCategoryEl) {
        questionCategoryEl.classList.add('hidden');
    }

    // Reset UI
    feedbackEl.classList.add('hidden');
    trueButton.style.display = 'block';
    falseButton.style.display = 'block';
    nextButton.style.display = 'none'; // Hidden by default in new flow
}

function handleAnswer(userAnswer) {
    if (currentQuestionIndex >= currentQuestions.length) return;

    const currentQ = currentQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQ.answer;

    questionsAnswered++;
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
    }

    // Hide the answer buttons immediately after selection
    trueButton.style.display = 'none';
    falseButton.style.display = 'none';

    if (isStudyMode) {
        showStudyFeedback(isCorrect, currentQ.answer);
    } else {
        showTimedFeedback(isCorrect);
    }
}


// ==================== NEW FEEDBACK SYSTEMS ====================
function showTimedFeedback(isCorrect) {
    feedbackText.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
    feedbackText.className = isCorrect ? 'correct' : 'incorrect';
    feedbackEl.classList.remove('hidden');

    // Auto advance after brief delay (fast flow)
    autoAdvanceTimeout = setTimeout(() => {
        feedbackEl.classList.add('hidden');
        currentQuestionIndex++;
        showQuestion();
    }, 750);
}

function showStudyFeedback(isCorrect, correctAnswer) {
    const correctText = correctAnswer ? 'True' : 'False';
    feedbackText.innerHTML = `
        <div style="margin-bottom: 8px;">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</div>
        <div style="font-size: 1.1rem; opacity: 0.9;">Correct answer: <strong>${correctText}</strong></div>
    `;
    feedbackText.className = isCorrect ? 'correct' : 'incorrect';
    feedbackEl.classList.remove('hidden');

    // Show the Next button for manual advance in Study mode
    nextButton.style.display = 'inline-block';
}

function nextQuestion() {
    clearTimeout(autoAdvanceTimeout);
    feedbackEl.classList.add('hidden');
    nextButton.style.display = 'none';
    trueButton.style.display = 'block';
    falseButton.style.display = 'block';
    currentQuestionIndex++;
    showQuestion();
}

// ==================== END GAME ====================
function endGame() {
    clearInterval(timerInterval);
    clearInterval(studyTimerInterval);
    clearTimeout(autoAdvanceTimeout);

    if (questionCategoryEl) questionCategoryEl.classList.add('hidden');
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');

    const endTitle = document.getElementById('end-title');
    const finalScoreContainer = document.querySelector('.final-score');

    if (isStudyMode) {
        // Study Mode end screen
        if (endTitle) endTitle.textContent = "All Questions Answered!";

        // Show selected category from picker
        if (endCategoryEl) {
            endCategoryEl.textContent = currentStudyCategory ? `Category: ${currentStudyCategory}` : "";
            endCategoryEl.classList.remove("hidden");
        }

        // Show correct / total answered
        const totalAnswered = questionsAnswered || currentQuestions.length;
        if (finalScoreContainer) {
            finalScoreContainer.innerHTML = `
                <span>You got</span>
                <span id="final-score" class="big-number">${score}</span>
                <span>out of</span>
                <span class="big-number">${totalAnswered}</span>
                <span>correct</span>
            `;
        }

        // Hide high score in study mode (it's only for Challenge mode)
        const endHighScoreBox = document.querySelector('#end-screen .high-score-box');
        if (endHighScoreBox) {
            endHighScoreBox.style.display = 'none';
        }

        // Also hide the start screen high score during study? (optional, but consistent)
        const startHighScoreBox = document.querySelector('.high-score-box');
        // We won't hide the main one permanently, just don't update it in study mode

    } else {
        // Timed / Challenge Mode
        if (endCategoryEl) {
            endCategoryEl.classList.add("hidden");
        }
        if (endTitle) endTitle.textContent = "Time's Up!";

        // Restore normal score display
        if (finalScoreContainer) {
            finalScoreContainer.innerHTML = `
                <span>You answered</span>
                <span id="final-score" class="big-number">${score}</span>
                <span>questions correctly</span>
            `;
        }

        // Show high score box again
        const endHighScoreBox = document.querySelector('#end-screen .high-score-box');
        if (endHighScoreBox) {
            endHighScoreBox.style.display = '';
        }

        // Update high score only in challenge mode
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('cyberMinuteHighScore', highScore);
            if (endHighScoreDisplay) endHighScoreDisplay.textContent = highScore;
            if (highScoreDisplay) highScoreDisplay.textContent = highScore;
        }
    }

    // Show submit score section only for legitimate Timed completions
    if (submitScoreSection) {
        if (!isStudyMode && sessionToken && quizStartTime) {
            submitScoreSection.classList.remove('hidden');
            if (playerNameInput) playerNameInput.value = "";
        } else {
            submitScoreSection.classList.add('hidden');
        }
    }
}

// Initialize the game
init();

// ============================================
// ==================== MENU / BACK TO START ====================
function showMenuConfirm() {
    menuModal.classList.remove('hidden');
}

function hideMenuConfirm() {
    menuModal.classList.add('hidden');
}

function goBackToMenu() {
    menuModal.classList.add('hidden');

    // Reset study state
    currentStudyCategory = null;

    clearInterval(timerInterval);
    clearInterval(studyTimerInterval);
    clearTimeout(autoAdvanceTimeout);

    // Clear submission state
    sessionToken = null;
    quizStartTime = null;
    sessionStorage.removeItem('cyberminute_session_token');

    gameScreen.classList.remove('active');
    endScreen.classList.remove('active');
    startScreen.classList.add('active');

    feedbackEl.classList.add('hidden');
    nextButton.style.display = 'none';
    trueButton.style.display = 'block';
    falseButton.style.display = 'block';
}



// ==================== LEADERBOARD SUBMISSION ====================
async function submitScoreToLeaderboard(playerName) {
    if (!sessionToken || !quizStartTime) {
        alert("Invalid session. Please complete a Timed quiz properly.");
        return;
    }

    // Use the frozen duration captured at quiz end (prevents counting extra time while on results screen)
    const duration = finalDuration !== null ? finalDuration : Math.floor((Date.now() - quizStartTime) / 1000);

    const payload = {
        name: playerName,
        score: score,
        duration: duration,
        session_token: sessionToken
    };

    console.log("Submitting score with payload:", payload);

    // Disable button during submission for better UX
    if (submitScoreBtn) submitScoreBtn.disabled = true;

    try {
        const response = await fetch("https://sbqjdgrchsbvfwgodhmt.supabase.co/functions/v1/submit-score", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(payload)
        });

        let result;
        try {
            result = await response.json();
        } catch (jsonErr) {
            console.error("Failed to parse JSON response:", jsonErr);
            alert(`Submission failed (status ${response.status}). The server did not return valid JSON.`);
            if (submitScoreBtn) submitScoreBtn.disabled = false;
            return;
        }

        console.log("Submission response:", response.status, result);

        if (response.ok) {
            // Success - hide the submit section and show confirmation
            if (submitScoreSection) {
                submitScoreSection.innerHTML = `
                    <div class="submit-success-btn" onclick="showLeaderboard();">
                        <div class="success-top">✅ Score submitted 📋</div>
                        <div class="success-view">View Leaderboard</div>
                    </div>
                `;
            }
            // Clear submission state after successful submission
            sessionToken = null;
            quizStartTime = null;
            finalDuration = null;
            sessionStorage.removeItem("cyberminute_session_token");
        } else {
            let errorMsg = "";
            if (result.error) {
                errorMsg = typeof result.error === "string" ? result.error : (result.error.message || JSON.stringify(result.error));
            }
            if (response.status === 429) {
                alert(errorMsg || "Too many submissions. Please wait before trying again.");
            } else if (errorMsg.toLowerCase().includes("session token")) {
                alert("This quiz session has already been submitted.");
            } else if (errorMsg) {
                alert("Error: " + errorMsg);
            } else {
                alert(`Submission failed (status ${response.status}). Please try again.`);
            }
            if (submitScoreBtn) submitScoreBtn.disabled = false;
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Network error: " + (err.message || "Could not reach the server."));
        if (submitScoreBtn) submitScoreBtn.disabled = false;
    }
}

// Subtle Matrix Digital Rain Background
// Very low density and opacity for atmosphere
// ============================================
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    // Cybersecurity-themed glyph pool (balanced mixture)
    // Singles (symbols, letters, Thai) appear more often naturally
    // Short meaningful terms (English + Thai) appear occasionally for the "mosaic" effect
    const cyberGlyphs = [
        // === Single characters (high frequency - core of the rain) ===
        '0','1','2','3','4','5','6','7','8','9',
        'A','B','C','D','E','F','H','K','P','R','S','T','V','X','Z',
        'λ','Δ','{}','[]','<>','/','\\','|','-','_','*','+','=','#','%','@','!',
        // Thai singles (kept for cultural relevance)
        '๐','๑','๒','๓','๔','๕','๖','๗','๘','๙',
        'ฟ','ิ','ช','แ','ร','น','ว','ั','ส','ม','ั','ล','แ','ฮ','ก','ร','ห','ั','ส',

        // === Short English cybersecurity terms ===
        '2FA','PHISH','HACK','RANSOM','BREACH','HASH','KEY','VPN','XSS','BOT','ZERO','CVSS','DDoS','MAL','VIR','SQL','NET',

        // === Short Thai cybersecurity terms ===
        'ฟิช','แรน','ไวรัส','มัล','แฮก','รหัส','2FA',

        // === Extra technical / hex feel ===
        'A','B','C','D','E','F','0','1','2','3','4','5','6','7','8','9'
    ];

    function draw() {
        // Very faint trail
        ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#67e8f9'; // Soft matrix green
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = cyberGlyphs[Math.floor(Math.random() * cyberGlyphs.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Slow fall + random reset
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Low frame rate for performance
    setInterval(draw, 120);
}

// Start the background
initMatrixBackground();
// ==================== LEADERBOARD ====================
const SUPABASE_URL = "https://sbqjdgrchsbvfwgodhmt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicWpkZ3JjaHNidmZ3Z29kaG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE4OTIsImV4cCI6MjA5NTcxNzg5Mn0.TD72cOY3QhxtLhOY6BFdhRmiz4WNpSacn3Nlc3z2_2c"; // Real anon key - safe for frontend

let currentLeaderboardTab = "all";


function showLeaderboard() {
    leaderboardModal.classList.remove("hidden");
    switchLeaderboardTab("all"); // Default to All Time

    // Close when clicking outside the modal content
    setTimeout(() => {
        leaderboardModal.onclick = function(e) {
            if (e.target === leaderboardModal) {
                leaderboardModal.classList.add("hidden");
            }
        };
    }, 10);
}


function switchLeaderboardTab(tab) {
    currentLeaderboardTab = tab;

    // Update active tab styling
    if (tab === "all") {
        tabAll.classList.add("active");
        tabToday.classList.remove("active");
    } else {
        tabToday.classList.add("active");
        tabAll.classList.remove("active");
    }

    fetchLeaderboard(tab);
}

async function fetchLeaderboard(view) {
    leaderboardContent.innerHTML = '<div class="loading">Loading leaderboard...</div>';

    try {
        let url = `${SUPABASE_URL}/rest/v1/scores?select=name,score,duration,completed_at&order=score.desc,completed_at.desc&limit=50`;

        const response = await fetch(url, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Leaderboard fetch failed:", response.status, errorText);
            throw new Error(`Failed to fetch leaderboard (${response.status}): ${errorText}`);
        }

        let scores = await response.json();

        // Client-side "Today" filter using Bangkok time (UTC+7)
        if (view === "today") {
            const BANGKOK_OFFSET_HOURS = 7;
            
            const now = new Date();
            
            // Convert current moment to Bangkok local time
            const bangkokNow = new Date(now.getTime() + (BANGKOK_OFFSET_HOURS * 60 * 60 * 1000));
            
            // Start of "today" in Bangkok timezone, converted back to a UTC timestamp for comparison
            // (because completed_at is stored in UTC in the database)
            const startOfBangkokDay = new Date(Date.UTC(
                bangkokNow.getUTCFullYear(),
                bangkokNow.getUTCMonth(),
                bangkokNow.getUTCDate()
            ));
            
            scores = scores.filter(s => {
                const completed = new Date(s.completed_at);
                return completed >= startOfBangkokDay;
            });
        }

        renderLeaderboard(scores, view);
    } catch (err) {
        console.error(err);
        leaderboardContent.innerHTML = '<div class="error-message">Could not load leaderboard. Please try again later.</div>';
    }
}

function renderLeaderboard(scores, view) {
    if (!scores || scores.length === 0) {
        leaderboardContent.innerHTML = `<div class="loading">No scores yet for ${view === "today" ? "today" : "all time"}.</div>`;
        return;
    }

    let html = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>When</th>
                </tr>
            </thead>
            <tbody>
    `;

    scores.forEach((entry, index) => {
        const date = new Date(entry.completed_at);
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const dateStr = `${d}/${m}/${y}`;

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td class="score">${entry.score}</td>
                <td>${dateStr}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    leaderboardContent.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Study Category Picker Modal (Phase B)
// ============================================

function showStudyCategoryModal() {
    if (!studyCategoryModal) return;

    studyCategoryModal.classList.remove('hidden');

    // Populate category buttons if not already done
    if (categoryGrid && categoryGrid.children.length === 0) {
        populateCategoryGrid();
    }

    // Wire All Categories button
    if (studyAllBtn) {
        studyAllBtn.onclick = () => {
            hideStudyCategoryModal();
            startStudyMode(null); // all categories
        };
    }

    // Close button
    if (closeStudyCategoryBtn) {
        closeStudyCategoryBtn.onclick = hideStudyCategoryModal;
    }

    // Close on outside click
    studyCategoryModal.onclick = (e) => {
        if (e.target === studyCategoryModal) {
            hideStudyCategoryModal();
        }
    };
}

function hideStudyCategoryModal() {
    if (studyCategoryModal) {
        studyCategoryModal.classList.add('hidden');
    }
}

function populateCategoryGrid() {
    if (!categoryGrid || !CATEGORIES) return;

    categoryGrid.innerHTML = '';

    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat.label;

        btn.onclick = () => {
            hideStudyCategoryModal();
            startStudyMode(cat.id);
        };

        categoryGrid.appendChild(btn);
    });
}

// Optional: Also allow end-screen Study button to open picker (Phase C decision)
// For now it still starts full study mode directly (as before)
