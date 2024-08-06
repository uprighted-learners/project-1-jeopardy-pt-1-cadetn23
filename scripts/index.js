let currentPlayer = 1;
let currentQuestion = null;
let round = 1;
let questionsAnswered = 0;


// let us commence 


function startGame() {
    currentPlayerTurn = document.querySelector('.Player-Turn');
    categoryBtns = document.querySelectorAll('.Category');
    modal = document.querySelector('.modal');
    guessBtn = document.querySelector('.Guess');
    passBtn = document.querySelector('.Pass');
    playerOneScore = document.querySelector('.player-one-score');
    playerTwoScore = document.querySelector('.player-two-score');
    modalQuestion = document.querySelector('.modal-question');

    updateScore();
    switchPlayer();
    disableButtons();
    fillCategories();
    addQuestionListeners();
}

document.addEventListener('DOMContentLoaded', startGame);


// i mean the functions function how they function 
function updateScore() {
    playerOneScore.textContent = parseInt(playerOneScore.textContent) || 0;
    playerTwoScore.textContent = parseInt(playerTwoScore.textContent) || 0;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentPlayerTurn.textContent = `Player ${currentPlayer}'s Turn`;
}

function disableButtons() {
    guessBtn.disabled = true;
    passBtn.disabled = true;
    document.querySelector('.next-round').disabled = true;
}

function enableButtons() {
    guessBtn.disabled = false;
    passBtn.disabled = false;
}

function addQuestionListeners() {
    const questionElements = document.querySelectorAll('[class^="cat-"][class$="100"], [class^="cat-"][class$="200"], [class^="cat-"][class$="300"], [class^="cat-"][class$="400"], [class^="cat-"][class$="500"]');
    questionElements.forEach(element => {
        element.addEventListener('click', () => {
            const [_, category, value] = element.className.split('-');
            selectQuestion(parseInt(category), parseInt(value));
        });
    });
}

function fillCategories() {
    const categoryElements = document.querySelectorAll('.Category');
    const uniqueCategories = [...new Set(placeholderQuestions.map(q => q.category))];
    categoryElements.forEach((element, index) => {
        element.textContent = uniqueCategories[index];
    });
}

function selectQuestion(category, value) {
    if (currentQuestion) {
        alert("You must answer or pass the current question.");
        return;
    }

    const questionElement = document.querySelector(`.cat-${category}-${value}`);
    if (questionElement.textContent === '') {
        alert("This question has already been answered.");
        return;
    }

    const questionIndex = (category - 1) * 5 + (value / 100 - 1);
    currentQuestionObject = placeholderQuestions[questionIndex];
    currentQuestion = currentQuestionObject;
    showModal(currentQuestionObject.question);
    enableButtons();
    questionElement.textContent = '';
    questionsAnswered++;
}

function showModal(question) {
    modalQuestion.textContent = question;
    modal.style.display = 'flex';
}

function hideModal() {
    modal.style.display = 'none';
}

function updatePlayerScore(player, value) {
    const scoreElement = player === 1 ? playerOneScore : playerTwoScore;
    scoreElement.textContent = parseInt(scoreElement.textContent) + value;
}

guessBtn.addEventListener('click', () => {
    const userAnswer = document.getElementById('Input-Box').value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        updatePlayerScore(currentPlayer, currentQuestion.value);
        alert("Correct answer!");
    } else {
        updatePlayerScore(currentPlayer, -currentQuestion.value);
        switchPlayer();
        alert("Incorrect answer. Other player's turn.");
    }

    updateScore();
    currentQuestion = null;
    hideModal();
    disableButtons();
    endRound();
});

passBtn.addEventListener('click', () => {
    switchPlayer();
    alert(`Question passed to Player ${currentPlayer}`);
});

//ends round and goes to the next
function endRound() {
    const player1Score = parseInt(playerOneScore.textContent);
    const player2Score = parseInt(playerTwoScore.textContent);
    if (round === 1 && (player1Score >= 15000 || player2Score >= 15000 || questionsAnswered === 30)) {
        document.querySelector('.next-round').disabled = false;
        alert("Round 1 completed! Proceed to Round 2.");
    } else if (round === 2 && (player1Score >= 30000 || player2Score >= 30000 || questionsAnswered === 30)) {
        document.querySelector('.next-round').disabled = false;
        document.querySelector('.next-round').textContent = "Final Round";
        alert("Round 2 completed! Proceed to Final Round.");
    }
}

document.querySelector('.next-round').addEventListener('click', () => {
    if (round === 1) {
        round = 2;
        startRound2();
    } else if (round === 2) {
        startFinalRound();
    }
});

function startRound2() {
    placeholderQuestions.forEach(q => q.value *= 2);
    questionsAnswered = 0;
    document.querySelector('header').textContent = "Second Round";
    updateScore();
    switchPlayer();
    fillCategories();
    resetBoard();
}

function resetBoard() {
    const questionElements = document.querySelectorAll('[class^="cat-"][class$="100"], [class^="cat-"][class$="200"], [class^="cat-"][class$="300"], [class^="cat-"][class$="400"], [class^="cat-"][class$="500"]');
    questionElements.forEach((element, index) => {
        const value = (Math.floor(index / 6) + 1) * 200;
        element.textContent = value;
    });
}

function startFinalRound() {
    // Redirect to Final Round page
    window.location.href = 'final-jeopardy.html';
}

// Hide the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});