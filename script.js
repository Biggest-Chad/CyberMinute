// Array of 50 true or false questions
const questions = [
    // Email Phishing (8 questions)
    { question: "Phishing emails often contain spelling and grammar mistakes.", answer: true },
    { question: "It's safe to click on links in emails from unknown senders if the email looks professional.", answer: false },
    { question: "Phishing emails can pretend to come from a trusted company.", answer: true },
    { question: "You should always verify the sender’s email address before replying to an email.", answer: true },
    { question: "Phishing emails never include attachments.", answer: false },
    { question: "Hovering over a link in an email can reveal if it’s suspicious.", answer: true },
    { question: "Phishing only happens through email, not text messages.", answer: false },
    { question: "All emails from your bank are safe to trust without checking.", answer: false },

    // Password Reuse (7 questions)
    { question: "Using the same password for multiple accounts increases the risk of a security breach.", answer: true },
    { question: "It’s okay to use the same password for all your work accounts if it’s strong.", answer: false },
    { question: "A strong password should include numbers, letters, and special characters.", answer: true },
    { question: "Writing down passwords on paper is safer than reusing them.", answer: true },
    { question: "Password managers can help you avoid reusing passwords.", answer: true },
    { question: "Short passwords are just as secure as long ones if they’re unique.", answer: false },
    { question: "You should change your passwords regularly to stay secure.", answer: true },

    // Email Scams (7 questions)
    { question: "Emails asking for urgent action or threatening consequences are likely scams.", answer: true },
    { question: "If an email comes from a known contact, it’s always safe to open attachments.", answer: false },
    { question: "Scammers can use fake email addresses that look real.", answer: true },
    { question: "Winning a prize in an email you didn’t enter is usually a scam.", answer: true },
    { question: "Emails asking for your password are legitimate if they’re from IT.", answer: false },
    { question: "You should report suspicious emails to your IT department.", answer: true },
    { question: "Email scams only target businesses, not individuals.", answer: false },

    // Avoiding Virus Infections (7 questions)
    { question: "Installing antivirus software can help protect your computer from viruses.", answer: true },
    { question: "Downloading software from unofficial sources is safe if it’s free.", answer: false },
    { question: "Updating your software regularly can prevent virus infections.", answer: true },
    { question: "Opening email attachments from unknown sources can infect your device.", answer: true },
    { question: "Viruses can only spread through email, not USB drives.", answer: false },
    { question: "Antivirus software guarantees 100% protection from all viruses.", answer: false },
    { question: "Clicking 'unsubscribe' on spam emails can stop viruses.", answer: false },

    // Reacting to Ransomware (7 questions)
    { question: "If you suspect a ransomware attack, you should disconnect your device from the network.", answer: true },
    { question: "Paying the ransom is the best way to get your files back after a ransomware attack.", answer: false },
    { question: "Ransomware can lock your files and demand payment to unlock them.", answer: true },
    { question: "You should report a ransomware attack to your IT team immediately.", answer: true },
    { question: "Backups can help you recover from a ransomware attack without paying.", answer: true },
    { question: "Ransomware only affects personal computers, not company devices.", answer: false },
    { question: "Restarting your computer will remove ransomware.", answer: false },

    // Personal Data Privacy (7 questions)
    { question: "Sharing your personal information on social media can increase the risk of identity theft.", answer: true },
    { question: "Using public Wi-Fi is always safe for browsing sensitive information.", answer: false },
    { question: "You should avoid sharing your full birth date online.", answer: true },
    { question: "Companies can sell your personal data if you agree to their terms.", answer: true },
    { question: "Two-factor authentication makes your accounts more secure.", answer: true },
    { question: "Your email address is not considered personal information.", answer: false },
    { question: "Posting vacation photos while away can alert burglars.", answer: true },

    // Secure Device Usage (7 questions)
    { question: "Locking your computer when you step away from your desk is a good security practice.", answer: true },
    { question: "It’s safe to leave your work laptop unattended in a public place if it’s turned off.", answer: false },
    { question: "Using a VPN can make your internet connection more secure.", answer: true },
    { question: "You should install apps on your work phone from any source.", answer: false },
    { question: "Keeping your device’s software up to date improves security.", answer: true },
    { question: "Sharing your work device with family members is a good practice.", answer: false },
    { question: "Turning off Bluetooth when not in use can reduce security risks.", answer: true }
];

// Game variables
let score = 0;
let currentQuestionIndex = 0;
let timer = 60;
let timerInterval;

// Shuffle function for randomizing questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Load the current question
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;
}

// Show feedback for correct/incorrect answers
function showFeedback(isCorrect) {
    if (isCorrect) {
        document.body.classList.add('correct');
    } else {
        document.body.classList.add('incorrect');
    }
    setTimeout(() => {
        document.body.classList.remove('correct', 'incorrect');
    }, 500);
}

// Check the user's answer
function checkAnswer(userAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    if (userAnswer === currentQuestion.answer) {
        score++;
        document.getElementById('score').textContent = score;
        showFeedback(true);
    } else {
        showFeedback(false);
    }
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && timer > 0) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 500);
}

// Start the 60-second timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// End the game and show the final score
function endGame() {
    document.querySelector('.game-screen').classList.add('hidden');
    document.querySelector('.end-screen').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

// Start or restart the game
function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    timer = 60;
    shuffle(questions);
    loadQuestion();
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timer;
    document.querySelector('.start-screen').classList.add('hidden');
    document.querySelector('.game-screen').classList.remove('hidden');
    document.querySelector('.end-screen').classList.add('hidden');
    startTimer();
}

// Event listeners
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('play-again').addEventListener('click', startGame);
document.getElementById('true-button').addEventListener('click', () => checkAnswer(true));
document.getElementById('false-button').addEventListener('click', () => checkAnswer(false));

// Initialize with the start screen visible
document.querySelector('.start-screen').classList.remove('hidden');
document.querySelector('.game-screen').classList.add('hidden');
document.querySelector('.end-screen').classList.add('hidden');