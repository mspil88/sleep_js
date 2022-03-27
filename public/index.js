const diaryDiv = document.querySelector(".diary");
const moodDiv = document.querySelector(".mood");
const relaxDiv = document.querySelector(".relax");
const dashDiv = document.querySelector(".dashboard");

diaryDiv.addEventListener("click", ()=> {
    window.location.href = "sleep_diary.html";
})

moodDiv.addEventListener("click", ()=> {
    window.location.href = "mood_survey.html";
})

relaxDiv.addEventListener("click", ()=> {
    window.location.href = "relax.html";
})

dashDiv.addEventListener("click", ()=> {
    window.location.href = "dash.html";
})