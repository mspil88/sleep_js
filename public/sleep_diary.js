const dateDivs = document.getElementsByClassName("dt-number");
const prevBtn = document.getElementsByClassName("btn-prev")[0];
const datesContainer = document.getElementsByClassName("dates-container")[0];
const saveSleepData = document.getElementsByClassName("diary-save")[0];
const timeToBed = document.getElementsByClassName("sel-to-bed");
const timeToSleep = document.getElementsByClassName("sel-to-sleep");
const numTimesAwake = document.getElementsByClassName("sel-times-awake");
const timeAwake = document.getElementsByClassName("sel-amount-time-awake");
const timeOutBed = document.getElementsByClassName("sel-out-bed");
const timeGetOutBed = document.getElementsByClassName("sel-get-out-bed");    
const sleptWell = document.getElementsByClassName("sel-slept-well");
const feelNextDay = document.getElementsByClassName("sel-felt-nxt-day");
const diaryDateElem = document.querySelector(".diary-date");

const splitTime = (time) => {
    const tempSplit = time.split(":");
    const dayPart = time.slice(time.length-2, time.length);
    return [parseInt(tempSplit[0]), parseInt(tempSplit[1].replace("am","").replace("pm", "")), dayPart]
}

const convertTo24hr = (timeArray) => {
    timeArrayCpy = [...timeArray];
    if(timeArray.includes("pm")) {
        timeArrayCpy[0] = timeArray[0] + 12  
    } else if((timeArray.includes(12)) & (timeArray.includes("am"))) {
        timeArrayCpy[0] = 0;
    } 
    return timeArrayCpy;
}

const splitConvert = (time) => {
    timeArray = splitTime(time);
    return convertTo24hr(timeArray);
}

const timeInBed = (startArray, endArray) => {
    SCALE_DECIMAL = 60;
    const start_h = startArray[0];
    const start_m =  startArray[1];
    const end_h = endArray[0];
    const end_m =  endArray[1];

    const start_time = start_h + start_m / SCALE_DECIMAL;
    const end_time = end_h + end_m / SCALE_DECIMAL;


    return ((start_time - end_time) + 24) % 24
}

const mapSelVals = (value) => {
    _maps = {'lt 15 mins': 15/60,
            '15 mins': 15/60,
            '30 mins': 30/60,
            '45 mins': 45/60,
            '1 hour': 1,
            '1 hour 15': 1 + 15/60,
            '1 hour 30': 1 + 30/60,
            '1 hour 45': 1 + 45/60,
            '2 hour': 2,
            '2 hour 15': 2 + 15/60,
            '2 hour 30': 2 + 30/60,
            '2 hour 45': 2 + 45/60,
            'gt 1 hour': 1,
            'gt 2 hour': 2,
            'gt 3 hours': 3
    }
    return _maps[value];
}

const timeAsleep = (hoursInBed, timeToFall, timeTogetOut, timeGaps) => {
    
    timeToFall = mapSelVals(timeToFall);
    timeTogetOut = mapSelVals(timeTogetOut);
    timeGaps = mapSelVals(timeGaps);
    
    return hoursInBed - timeToFall - timeTogetOut - timeGaps
    
    
}

const mapEmoji = (response) => {
    const emojiMap = {
        yes: "😊",
        no: "🙁",
        somewhat: "😑"
    }
    return emojiMap[response];
}



const sleepData = (timeToBed, timeToSleep, numTimesAwake, timeAwake, timeOutBed, timeGetOutBed, sleptWell, 
                  feelNextDay, hoursInBed, totalTimeAsleep, sef, diaryDateEntry, weekIdx) => {
    return {bedTime: timeToBed.value,
    timeToFallAsleep: timeToSleep.value,
    numberTimesAwake: numTimesAwake.value,
    amountTimeAwake: timeAwake.value,
    timeGotOutBed: timeOutBed.value,
    timeToGetOutBed: timeGetOutBed.value,
    qualityOfSleep: mapEmoji(sleptWell.value),
    nextDayFeeling: feelNextDay.value,
    hoursSpentInBed: hoursInBed,
    hoursSpentAsleep: totalTimeAsleep,
    sleepEfficiencyScore: sef,
    diaryDate: diaryDateEntry,
    weekIndex: weekIdx
    }
}

const sleepEfficiency = (timeSpentAsleep, timeSpentInBed) => {
    return Math.round(Number(timeSpentAsleep/ timeSpentInBed)*100, 1);
}

const postSleepData = async(sleepObj) => {
    const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
    try {
        let result = await axios.post("api/v1/sleep", sleepObj, config);
    }
    catch (error) {
        console.error(error.response.data);
    }
}

const getSleepData = async() => {
    const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
    let sleepData = await axios.get("api/v1/sleep", config);
    return sleepData.data;
}

const patchSleepData = async(sleepId, sleepObj) => {
    const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
    await axios.patch(`api/v1/sleep/${sleepId}`, sleepObj, config)
}

const checkIfAlreadyCompleted = (choosenDiaryDate) => {
    const sleepData = JSON.parse(localStorage.getItem("sleepData"));
    let _id = []
    let found = false;
    for(let i of sleepData) {
        if(i.diaryDate === choosenDiaryDate) {
            console.log("entry already exists")
            _id.push(i._id);
            found = true;
        }
    }
    return [found, _id[0]];
}


saveSleepData.addEventListener("click", ()=> {
    console.log("clicked save button");
    const s1 = splitConvert(timeToBed[0].value);
    const s2 = splitConvert(timeOutBed[0].value);
    const hoursInBed = timeInBed(s2, s1);
    const totalTimeAsleep = timeAsleep(hoursInBed, timeToSleep[0].value, timeGetOutBed[0].value, timeAwake[0].value);
    const sleepEfficiencyScore = sleepEfficiency(totalTimeAsleep, hoursInBed);
    const diaryDateToEnter = diaryDateElem.textContent.replace("Diary for: ", "");
    const weekIndex = `${diaryDateToEnter} ${new Date().getFullYear()}`

    data = sleepData(timeToBed[0], timeToSleep[0], numTimesAwake[0], timeAwake[0], timeOutBed[0], timeGetOutBed[0], 
                    sleptWell[0], feelNextDay[0], hoursInBed, totalTimeAsleep, sleepEfficiencyScore, diaryDateToEnter, dayWeekHash[weekIndex]);
    
    let [completed, _id] = checkIfAlreadyCompleted(diaryDateToEnter);

    if(completed) {
        console.log("patching")
        patchSleepData(_id, data);
    } else {
        console.log("posting")
        postSleepData(data);
    }
})


const zipped3 = (x, y, z) => Array(Math.max(x.length, y.length, z.length)).fill().map((_,i) => [x[i], y[i], z[i]]);


const daysToNavigate = () => {
    let days = []
    let months = []
    let day_ints = [];
    const daysToIterate = Array(13).fill(1);
    const d = new Date();
    const startDate = new Date().toString().split(" ");
    days.push(startDate[0]);
    months.push(startDate[1]);
    day_ints.push(startDate[2]);

    for(let i of daysToIterate) {
        let day = new Date(d.setDate(d.getDate()-i)).toString().split(" ")
        days.push(day[0]);
        months.push(day[1]);
        day_ints.push(day[2]);
    }

    return [days.reverse(), months.reverse(), day_ints.reverse()];
}

let [dayArray, monthArray, dateArray] = daysToNavigate();


const dateOject = (day, month, date) => {
    return {days: day,
           months: month,
           dates: date}
}


const createDateContainer = (day, months, date_ints) => {
    let dateContainer = [];

    for(let [i, j, k] of zipped3(day, months, date_ints)) {
        dateContainer.push(dateOject(i, j, k))
    }

    return dateContainer

}

const dateContainer = createDateContainer(dayArray, monthArray, dateArray);


window.onload = async () => {
    defaultDiaryDate = dateContainer[dateContainer.length-1];
    console.log(dateContainer);
    const diaryFor = document.querySelector(".diary-date");
    const dateText = `${defaultDiaryDate.days} ${defaultDiaryDate.dates} ${defaultDiaryDate.months}`;
    diaryFor.innerHTML = `Diary for: ${dateText}`;
    let sleepData = await getSleepData();
    localStorage.setItem("sleepData", JSON.stringify(sleepData.sleep));

}


class DateSlider {
    constructor(root, dateObj) {
        this.root = root;
        this.dateObj = dateObj;
        this.currentDates = null;

        this.elem = {
            prev: root.querySelector(".btn-prev"),
            next: root.querySelector(".btn-next"),
            dt1: root.querySelector(".dt-1"),
            dt2: root.querySelector(".dt-2"),
            dt3: root.querySelector(".dt-3"),
            dt4: root.querySelector(".dt-4"),
            dt5: root.querySelector(".dt-5"),
            dt6: root.querySelector(".dt-6"),
            dt7: root.querySelector(".dt-7"),
            diaryDate: document.querySelector(".diary-date")
        };
        this.elems = [this.elem.dt1, this.elem.dt2, this.elem.dt3, this.elem.dt4, this.elem.dt5, this.elem.dt6, this.elem.dt7];
        this.setInitialDates();
    
    this.elem.prev.addEventListener("click", ()=> {
        console.log("prev button");

        try {
            let [dates, days, months] = this.getCurrentDateBounds("backwards");
            this.setDates(dates, days, months);
        } catch(error) {
            console.log("error")
            //make button purple and/ or disable
        }
    })
    //PLACEHOLDER TO CHECK IT WORKS
    this.elem.dt1.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt1.children[0].textContent.split(" ");
        const dateVal = this.elem.dt1.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt2.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt2.children[0].textContent.split(" ");
        const dateVal = this.elem.dt2.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt3.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt3.children[0].textContent.split(" ");
        const dateVal = this.elem.dt3.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt4.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt4.children[0].textContent.split(" ");
        const dateVal = this.elem.dt4.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt5.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt5.children[0].textContent.split(" ");
        const dateVal = this.elem.dt5.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt6.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt6.children[0].textContent.split(" ");
        const dateVal = this.elem.dt6.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.dt7.addEventListener("click", ()=> {
        const dayMonth = this.elem.dt7.children[0].textContent.split(" ");
        const dateVal = this.elem.dt7.children[1].textContent;
        const dateText = `${dayMonth[0]} ${dateVal} ${dayMonth[1]}`;
        this.elem.diaryDate.innerHTML = `Diary for: ${dateText}`;
    })

    this.elem.next.addEventListener("click", ()=> {
        console.log("next button");
        try {
            let [dates, days, months] = this.getCurrentDateBounds("forwards");
            this.setDates(dates, days, months);
        } catch (error) {
            console.log("index out of bounds")
        }
    })}

    setInitialDates() {
        const initialDates = this.dateObj.slice(7, this.dateObj.length);
        const zipped2 = (x, y) => Array(Math.max(x.length, y.length)).fill().map((_,i) => [x[i], y[i]]);

        for(let [i, j] of zipped2(this.elems, initialDates)) {
            i.querySelector(".dt-number").innerHTML = j.dates;
            i.querySelector(".dt-text").innerHTML = `${j.days} ${j.months}`;
        };
        
    }

    setDateForDiary(objElem) {
        const dayMonth = objElem.children[0].textContent.split(" ");
        const dateVal = objElem.dateElem.children[1].textContent;
        const dateText = `${dateVal} ${dayMonth[0]} ${dayMonth[1]}`;
        return dateText
    }

    getCurrentDateBounds(direction) {
        this.currentDates = [this.elem.dt1.querySelector(".dt-number").innerHTML, this.elem.dt7.querySelector(".dt-number").innerHTML];
        const [_min, _max] = this.currentDates;
       
        let dates_container = [];
        let days_container = [];
        let month_container = [];

        for(let i of this.dateObj) {
            dates_container.push(i.dates);
            days_container.push(i.days);
            month_container.push(i.months);
        } 

        const minIdx = dates_container.indexOf(_min);
        const maxIdx = dates_container.indexOf(_max);

    


        //this does need a clean up but works for now
        if((direction === "backwards") && (minIdx > 0)) {
            return [dates_container.slice(minIdx-1, maxIdx), days_container.slice(minIdx-1, maxIdx), 
                month_container.slice(minIdx-1, maxIdx)];            
        } else if((direction === "forwards") && (maxIdx+2 <= 14)) {
            return [dates_container.slice(minIdx+1, maxIdx+2), days_container.slice(minIdx+1, maxIdx+2), 
                month_container.slice(minIdx+1, maxIdx+2)];
        }
    }

    setDates(dates, days, months) {
        const elems = [this.elem.dt1, this.elem.dt2, this.elem.dt3, this.elem.dt4, this.elem.dt5, this.elem.dt6, this.elem.dt7];
        const zipped = (x, y, z, a) => Array(Math.max(x.length, y.length, z.length, 
                                                a.length)).fill().map((_,i) => [x[i], y[i], z[i], a[i]]);

        for(let [i, j, k, w] of zipped(this.elems, dates, days, months)) {
            i.querySelector(".dt-number").innerHTML = j;
            i.querySelector(".dt-text").innerHTML = `${k} ${w}`;
        };

    }
};

const dayWeekIdxHash = () => {

    const dateHash = (x, y) => {
        return {[x]: y}
    }
    
    const zippedObj = (x, y) => Array(Math.min(x.length, y.length)).fill().map((_,i) => dateHash(x[i], y[i]));
    
    const DAYDIFF_CONST = 24*3600*1000;
    const startDate = new Date("Mon 7 Mar 2022")
    const endDate = new Date().toString();
    const dayDifference = Math.floor((new Date(endDate) - new Date(startDate))/DAYDIFF_CONST);
    
    const daysToIterate = Array(dayDifference).fill(1);
    const numWeeks = Math.ceil(dayDifference/7);

    let dates = [];
    let weekIdx = [];
    
    const initialDate = startDate.toString().slice(0, 15).split(" ")
    dates.push(`${initialDate[0]} ${initialDate[2]} ${initialDate[1]} ${initialDate[3]}`);

    for(let i of daysToIterate) {
        const dt = new Date(startDate.setDate(startDate.getDate()+i)).toString().slice(0, 15).split(" ")
        dates.push(`${dt[0]} ${dt[2]} ${dt[1]} ${dt[3]}`);
    }

    for(let i=0; i < numWeeks; i++) {
        weekIdx.push(...Array(7).fill(i));
    }

    let zipped = zippedObj(dates, weekIdx);

    return Object.assign({}, ...zipped);
}

const dayWeekHash = dayWeekIdxHash();

console.log(dayWeekHash);

let dateSlider = new DateSlider(datesContainer, dateContainer);