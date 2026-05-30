// ============================================
// CyberMinute2 - Refactored Game Logic
// All original questions and rules preserved
// Enhanced with new Timed auto-advance + Study mode flows
// ============================================

const questions = [
    // Email Phishing
    { question: "Phishing emails often contain spelling and grammar mistakes.", answer: true },
    { question: "It's safe to click on links in emails from unknown senders if the email looks professional.", answer: false },
    { question: "Phishing emails can pretend to come from a trusted company.", answer: true },
    { question: "You should always verify the sender's email address before replying to an email.", answer: true },
    { question: "Phishing emails never include attachments.", answer: false },
    { question: "Hovering over a link in an email can reveal if it's suspicious.", answer: true },
    { question: "Phishing only happens through email, not text messages.", answer: false },
    { question: "All emails from your bank are safe to trust without checking.", answer: false },
    { question: "Phishing emails often try to create urgency to make you act without thinking.", answer: true },
    { question: "The sender name displayed in your inbox is always the real sender.", answer: false },
    { question: "Hackers can create fake websites that look almost identical to legitimate ones.", answer: true },
    { question: "Verifying suspicious requests by calling the company using a publicly known phone number is a good practice.", answer: true },
    { question: "Phishing attempts can include fake security alerts from your IT department.", answer: true },
    { question: "It's safe to click links in emails if they match the company's branding perfectly.", answer: false },
    { question: "Business email compromise is a sophisticated form of phishing attack.", answer: true },
    { question: "You should never enter login credentials on a website reached via an email link.", answer: true },

    // Password Security
    { question: "Using the same password for multiple accounts increases the risk of a security breach.", answer: true },
    { question: "It's okay to use the same password for all your work accounts if it's strong.", answer: false },
    { question: "A strong password should include numbers, letters, and special characters.", answer: true },
    { question: "Writing down passwords on paper is safer than reusing them.", answer: true },
    { question: "Password managers can help you avoid reusing passwords.", answer: true },
    { question: "Short passwords are just as secure as long ones if they're unique.", answer: false },
    { question: "You should change your passwords regularly to stay secure.", answer: true },
    { question: "Using the same password on multiple websites puts all those accounts at risk if one is breached.", answer: true },
    { question: "Password managers help generate and store strong, unique passwords for each account.", answer: true },
    { question: "It's acceptable to reuse passwords if you add a number at the end for each site.", answer: false },
    { question: "A passphrase made of several random words is often more secure than a short complex password.", answer: true },
    { question: "You should use the same password for low-risk sites like news websites.", answer: false },
    { question: "Weak passwords can be guessed or cracked very quickly by hackers.", answer: true },
    { question: "Multi-factor authentication can help protect your accounts even if your password is reused and stolen.", answer: true },

    // Email Scams
    { question: "Emails asking for urgent action or threatening consequences are likely scams.", answer: true },
    { question: "If an email comes from a known contact, it's always safe to open attachments.", answer: false },
    { question: "Scammers can use fake email addresses that look real.", answer: true },
    { question: "Winning a prize in an email you didn't enter is usually a scam.", answer: true },
    { question: "Emails asking for your password are legitimate if they're from IT.", answer: false },
    { question: "You should report suspicious emails to your IT department.", answer: true },
    { question: "Email scams only target businesses, not individuals.", answer: false },
    { question: "Emails promising large sums of money for helping transfer funds are usually scams.", answer: true },
    { question: "Fake technical support emails claiming your computer has a virus are common scams.", answer: true },
    { question: "You should always double-check email addresses carefully, looking for subtle misspellings.", answer: true },
    { question: "Scammers may impersonate colleagues to request wire transfers or gift cards.", answer: true },
    { question: "If an email asks you to pay an unexpected invoice urgently, it could be fraudulent.", answer: true },
    { question: "Reporting scam emails helps protect others in your organization.", answer: true },
    { question: "Email scams can lead to financial loss or data theft for both companies and individuals.", answer: true },

    // Virus Prevention
    { question: "Installing antivirus software can help protect your computer from viruses.", answer: true },
    { question: "Downloading software from unofficial sources is safe if it's free.", answer: false },
    { question: "Updating your software regularly can prevent virus infections.", answer: true },
    { question: "Opening email attachments from unknown sources can infect your device.", answer: true },
    { question: "Viruses can only spread through email, not USB drives.", answer: false },
    { question: "Antivirus software guarantees 100% protection from all viruses.", answer: false },
    { question: "Clicking 'unsubscribe' on spam emails can stop viruses.", answer: false },
    { question: "Malware can be disguised as legitimate software updates or downloads.", answer: true },
    { question: "Visiting compromised websites can (rarely) automatically download malware to your computer.", answer: true },
    { question: "Keeping your operating system and applications updated is important for security.", answer: true },
    { question: "USB drives from unknown sources should never be plugged into work computers without scanning.", answer: true },
    { question: "Antivirus programs should be kept running and updated at all times.", answer: true },
    { question: "Opening PDFs or Word documents from unknown sources is completely safe.", answer: false },
    { question: "Using a firewall provides an additional layer of protection against viruses.", answer: true },

    // Ransomware
    { question: "If you suspect a ransomware attack, you should disconnect your device from the network.", answer: true },
    { question: "Paying the ransom is the best way to get your files back after a ransomware attack.", answer: false },
    { question: "Ransomware can lock your files and demand payment to unlock them.", answer: true },
    { question: "You should report a ransomware attack to your IT team immediately.", answer: true },
    { question: "Backups can help you recover from a ransomware attack without paying.", answer: true },
    { question: "Ransomware only affects personal computers, not company devices.", answer: false },
    { question: "Restarting your computer will remove ransomware.", answer: false },
    { question: "In a suspected ransomware incident, you should avoid using the infected device for any work.", answer: true },
    { question: "Ransomware attacks often spread to other computers on the same network.", answer: true },
    { question: "You should never pay the ransom demanded by attackers.", answer: true },
    { question: "Having recent, clean backups stored separately can help recover from ransomware.", answer: true },
    { question: "Ransomware can also steal your data before encrypting your files.", answer: true },
    { question: "Immediately notifying your supervisor or IT helpdesk is crucial during a ransomware attack.", answer: true },
];

// Game State
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = 60;
let timerInterval = null;
let studyTimerInterval = null;
let studyStartTime = null;
let isStudyMode = false;
let highScore = localStorage.getItem('cyberMinuteHighScore') || 0;
let autoAdvanceTimeout = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startButton = document.getElementById('start-button');
const studyButton = document.getElementById('study-button');
const playAgainButton = document.getElementById('play-again');
const endStudyButton = document.getElementById('end-study-button');

const questionEl = document.getElementById('question');
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

// Initialize
function init() {
    highScoreDisplay.textContent = highScore;
    endHighScoreDisplay.textContent = highScore;

    startButton.addEventListener('click', () => startGame(false));
    studyButton.addEventListener('click', () => startGame(true));
    playAgainButton.addEventListener('click', () => startGame(false));
    endStudyButton.addEventListener('click', () => startGame(true));

    trueButton.addEventListener('click', () => handleAnswer(true));
    falseButton.addEventListener('click', () => handleAnswer(false));
    nextButton.addEventListener('click', nextQuestion);
}

function startGame(studyMode) {
    isStudyMode = studyMode;
    currentQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    timer = 60;

    // Clear any previous timers
    clearInterval(timerInterval);
    clearInterval(studyTimerInterval);
    clearTimeout(autoAdvanceTimeout);

    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    gameScreen.classList.add('active');

    scoreEl.textContent = score;
    feedbackEl.classList.add('hidden');

    // Reset study timer display if needed
    if (isStudyMode) {
        timerEl.textContent = '0:00';
        timerEl.style.color = 'var(--accent)';
        startStudyTimer();
    } else {
        timerEl.style.color = '';
        startCountdown();
    }
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

    // Reset UI
    feedbackEl.classList.add('hidden');
    trueButton.style.display = 'block';
    falseButton.style.display = 'block';
    nextButton.style.display = 'none'; // Hidden by default in new flow
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

    gameScreen.classList.remove('active');
    endScreen.classList.add('active');

    finalScoreEl.textContent = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('cyberMinuteHighScore', highScore);
        endHighScoreDisplay.textContent = highScore;
        highScoreDisplay.textContent = highScore;
    }
}

// Initialize the game
init();

// ============================================
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

    // Very subtle character set
    const chars = '01アイウエオカキクケコサシスセソタチツテト';

    function draw() {
        // Very faint trail
        ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4ade80'; // Soft matrix green
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
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