const questionText = document.querySelector(".question-text")
const answerOptions = document.querySelector(".answer-options")
const nextQusBtn = document.querySelector(".next-question-btn")
const questionStatus = document.querySelector(".question-status")
const TimerCount = document.querySelector(".time-duration")
const resultText = document.querySelector(".result-message")
const configContainer = document.querySelector(".config-container")
const resultContainer = document.querySelector(".result-container")
const quizContainer = document.querySelector(".quiz-container")
const tryAgainBtn = document.querySelector(".try-again-btn")
const startQuizBtn = document.querySelector(".start-quiz-btn")
const questionsCategory = document.querySelectorAll(".category-option, .question-option")

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions  = 5;
let currentQuestion = null;
const questionsIndexHistory = [];
let correctAnwerCount = 0;



// display the quiz result and hide the quiz container 
const showQuizResult = () => {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const resultMessage = `You answered <b>${correctAnwerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly, Great effort!`;

    resultText.innerHTML = resultMessage;
}

const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    TimerCount.textContent = `${currentTime}s`;
}


const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        TimerCount.textContent = `${currentTime}s`;

        if(currentTime <= 0){

            clearInterval(timer);
            
            hightlightCorrectAnswer();
            
            nextQusBtn.style.visibility = "visible";

            // timer background red when time is over 
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

            // disable all answer option after one option is selected 
            answerOptions.querySelectorAll(".answer-option").forEach(option => (option.style.pointerEvents = 'none'));

        }
    } , 1000)
}
// fetch a random questions fro based on the select category 
const getRandomQuestions = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    // show the result if all question are attempted 
    if(questionsIndexHistory.length >= Math.min(categoryQuestions.length , numberOfQuestions)){
        return showQuizResult();
    }

    // filter a random questio from based on the selected category 
    const availableQuestions = categoryQuestions.filter((_ , index) => !questionsIndexHistory.includes(index));
    // to get random question from the range of 25 
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    // console.log(categoryQuestions);
    // console.log(randomQuestion);
    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

// hightlight the correct answer option 
const hightlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add('correct');

    const iconHTML = `
        <span class="material-symbols-rounded">
            check_circle
        </span>
    `;
    correctOption.insertAdjacentHTML("beforeend" , iconHTML);
}

// handle the user's answer selector
const handleAnswer = (option , answerIndex) => {
    // when click the answer then time is reset
    clearInterval(timer);
    

    const isCorrect = currentQuestion.correctAnswer === answerIndex;

    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    !isCorrect ? hightlightCorrectAnswer() : correctAnwerCount++;

    // insert icon based on correctness
    const iconHTML = `
        <span class="material-symbols-rounded">
            ${isCorrect ? 'check_circle' : 'cancel'}
        </span>
    `;
    option.insertAdjacentHTML("beforeend" , iconHTML);

    // disable all answer option after one option is selected 
    answerOptions.querySelectorAll(".answer-option").forEach(option => (option.style.pointerEvents = 'none'));

    nextQusBtn.style.visibility = "visible";
}

const renderQuestion = () => {
    currentQuestion = getRandomQuestions();

    if(!currentQuestion) return;

    // console.log(currentQuestion);
    resetTimer();
    startTimer();
    

    // first empty the answer container 
    answerOptions.innerHTML = "";

    nextQusBtn.style.visibility = "hidden";

    quizContainer.querySelector(".quiz-timer").style.background = "#32313C"

    questionText.textContent = currentQuestion.question;

    questionStatus.innerHTML = `
        <b>${questionsIndexHistory.length}</b>
         of 
        <b>${numberOfQuestions}</b> 
         Questions
    `;

    // create option li element and append them 
    currentQuestion.options.forEach((option , index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;

        answerOptions.appendChild(li);

        li.addEventListener("click" , () => handleAnswer(li , index))
    });
}

//start the quiz and render the rendom questions
const startQuiz = () => {
    configContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    // update quiz category and number of question 
    quizCategory = configContainer.querySelector('.category-option.active').textContent;
    numberOfQuestions  = parseInt(configContainer.querySelector('.question-option.active').textContent);

    renderQuestion();
}

// reset the quiz and return to the configuration container 
const resetQuiz = () => {
    resetTimer();
    correctAnwerCount = 0;
    questionsIndexHistory.length = 0;
    configContainer.style.display = 'block';
    resultContainer.style.display = 'none';
}

// hightlight the selected option on click - category or number of questions
questionsCategory.forEach(option => {
    option.addEventListener('click' , () => {
        option.parentNode.querySelector('.active').classList.remove('active');
        option.classList.add('active');
    })
})


nextQusBtn.addEventListener("click" , renderQuestion);
tryAgainBtn.addEventListener('click' , resetQuiz);
startQuizBtn.addEventListener('click' , startQuiz);