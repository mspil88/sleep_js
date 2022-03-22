const moodQuestionTitle = document.querySelector(".mood-question-title");
const moodQuestion = document.querySelector(".mood-question");
const questionResponseContainer = document.querySelector(".question-response-container");
const btns = document.querySelectorAll("button");

const questionArray = ["Question 2 of 16", "Question 3 of 16", "Question 4 of 16", "Question 5 of 16", "Question 6 of 16",
    "Question 7 of 16", "Question 8 of 16", "Question 9 of 16", "Question 10 of 16",
    "Question 11 of 16", "Question 12 of 16", "Question 13 of 16", "Question 14 of 16", "Question 15 of 16",
    "Question 16 of 16", "Results"]

const questionsArray = [
    "How often have you had little interest or pleasure in doing things?",
    "How often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    "How often have you been bothered by feeling tired or having little energy?",
    "How often have you been bothered by poor appetite or overeating?",
    "How often have you been bothered by feeling bad about yourself, or that you are a failure, or have let yourself or your family down?",
    "How often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
    "How often have you been bothered by moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    "How often have you been bothered by feeling nervous, anxious or on edge?",
    "How often have you been bothered by not being able to stop or control worrying?",
    "How often have you been bothered by worrying too much about different things?",
    "How often have you been bothered by having trouble relaxing?",
    "How often have you been bothered by being so restless that it is hard to sit still?",
    "How often have you been bothered by becoming easily annoyed or irritable?",
    "How often have you been bothered by feeling afraid as if something awful might happen?",
    "Have you been bothered by worrying about any of the following?",
]

let dataContainer = [];

const getScore = (questionResponse) => {
    return questionResponse === "Not at all"                ?   0   :
           questionResponse === "Several days"              ?   1   :
           questionResponse === "More than half the days"   ?   2   :
                                                                3
}

const moodSurveyResponses = (questionNumber, questionResponse, answer) => {
    return {'questionNumber': questionNumber, 'questionResponse': questionResponse,
            'answer': answer, 'score': getScore(questionResponse)}
}

const appendQuestionData = (questionNumber) => {
    
    questionResponseContainer.childNodes.forEach((node)=> {
    if(node.tagName == "LABEL") {
        const checked = node.childNodes[1].checked;
        if(checked) {
            dataContainer.push(moodSurveyResponses(questionNumber, node.childNodes[0].nodeValue.trim(), checked))};
    }})};


const clearOptions = () => {
    questionResponseContainer.childNodes.forEach((node)=> {
        if(node.tagName == "LABEL") {
            node.childNodes[1].checked = false;
        }
    })
}

btns.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const action = event.currentTarget.className;
        const questionValue = moodQuestionTitle.innerHTML;
        const questionArrayLen = questionArray.length;
        const currentIndex = questionArray.indexOf(questionValue);
        

        if((action.includes("next")) && (currentIndex < questionArrayLen)) {
            console.log("next");
            //push the question data
            appendQuestionData(currentIndex);
            console.log(dataContainer);
            
            const nextQuestionValue = questionArray[currentIndex+1];
            const nextQuestion = questionsArray[currentIndex+1];
            moodQuestionTitle.innerHTML = nextQuestionValue;
            moodQuestion.innerHTML = nextQuestion;
            clearOptions(); 
        }
        
    })
}
)


        