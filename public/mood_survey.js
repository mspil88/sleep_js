const moodQuestionTitle = document.querySelector(".mood-question-title");
const moodQuestion = document.querySelector(".mood-question");
const questionResponseContainer = document.querySelector(".question-response-container");
const btns = document.querySelectorAll("button");
const moodQuestionContainer = document.querySelectorAll(".mood-question-container");
const nextBackContainer = document.querySelector(".next-back-container");

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
            dataContainer.push(moodSurveyResponses(questionNumber, node.childNodes[0].nodeValue.trim(), checked))}
        // else {
        //     dataContainer.push(moodSurveyResponses(questionNumber, node.childNodes[0].nodeValue.trim(), 0))
        // };
    }})};


const clearOptions = () => {
    questionResponseContainer.childNodes.forEach((node)=> {
        if(node.tagName == "LABEL") {
            node.childNodes[1].checked = false;
        }
    })
}

const startSurvey = () => {
    moodQuestion.style.visibility = "visible";
    moodQuestionTitle.style.visibility = "visible";
    questionResponseContainer.style.visibility = "visible";
    nextBackContainer.style.visibility = "visible";
    const startBtn = document.querySelector(".start-btn"); 
    startBtn.disabled = true;
    startBtn.style.color = "white";
    startBtn.style.backgroundColor ="#301934";

}

const countSurveyScores = (surveyResponses) => {
    let depressionScores = 0;
    let anxietyScores = 0; 

    for(let i of surveyResponses) {
        if(i.questionNumber <= 6) {
            depressionScores += i.score;
        } else {
            anxietyScores += i.score;
        }
    }
    return [depressionScores, anxietyScores];
}

const clearQuestions = () => {
    questionResponseContainer.remove();
    moodQuestion.remove();
    nextBackContainer.remove();
}

function createProgBar(parent, type, value) {
    const e = document.createElement("div")
    e.id = "results-container";
    const p = document.createElement("p")
    p.innerHTML = `Your ${type} score is  `;
    p.id = `${type}-score`;
    const s = document.createElement("span");
    s.id = `${type}-score-val`;
    const prog = document.createElement("progress");
    prog.id = `${type}-prog`;
    prog.max = 24;
    parent.appendChild(e);
    parent.appendChild(p);
    p.appendChild(s);
    parent.appendChild(prog);
    s.innerHTML= value;
    prog.value = value;
}

const resultsComparison = (parent) => {
    const thisWeekPrevWeek = document.createElement("div");
    const prevDepression = document.createElement("span");
    const prevAnxiety = document.createElement("span");
    thisWeekPrevWeek.id = "this-week-prev-week-container"
    prevDepression.id = "prev-depression-score"
    prevAnxiety.id = "prev-anxiety-score"
    prevDepression.innerHTML = "Your score has increased by x points"
    prevAnxiety.innerHTML = "Your score has increased by x points"

    thisWeekPrevWeek.append(prevDepression);
    thisWeekPrevWeek.append(prevAnxiety);

    parent.appendChild(thisWeekPrevWeek);

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

            if(currentIndex === 14) {
                console.log("hit index");
                clearQuestions();
                let [depression, anxiety] = countSurveyScores(dataContainer);
                moodQuestionTitle.style.fontWeight = "bold";
                console.log(depression, anxiety)
                createProgBar(moodQuestionContainer[0], "depression", depression);
                createProgBar(moodQuestionContainer[0], "anxiety", anxiety);
                resultsComparison(moodQuestionContainer[0]);
            }
            
        }
        else if((action.includes("start"))) {
            console.log("start")
            startSurvey();
            
        }
        
    })
}
)


        