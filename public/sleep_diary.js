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


const sleepData = (timeToBed, timeToSleep, numTimesAwake, timeAwake, timeOutBed, timeGetOutBed, sleptWell, feelNextDay, timeInBed) => {
    return {bedTime: timeToBed.value,
    timeToFallAsleep: timeToSleep.value,
    numberTimesAwake: numTimesAwake.value,
    amountTimeAwake: timeAwake.value,
    timeGotOutBed: timeOutBed.value,
    timeToGetOutBed: timeGetOutBed.value,
    qualityOfSleep: sleptWell.value,
    nextDayFeeling: feelNextDay.value,
    timeSpentInBed: timeInBed
    
    }
}

const sleepEfficiency = (timeSpentAsleep, timeSpentInBed) => {
    return Math.round(Number(timeSpentAsleep/ timeSpentInBed)*100, 1);
}


saveSleepData.addEventListener("click", ()=> {
    console.log("clicked save button");
    const s1 = splitConvert(timeToBed[0].value);
    const s2 = splitConvert(timeOutBed[0].value);
    const hoursInBed = timeInBed(s2, s1);
    console.log(`time in bed ${hoursInBed}`);
    const totalTimeAsleep = timeAsleep(hoursInBed, timeToSleep[0].value, timeGetOutBed[0].value, timeAwake[0].value);
    console.log(`time asleep ${totalTimeAsleep}`);
    console.log(`SEF: ${sleepEfficiency(totalTimeAsleep, hoursInBed)}`)
    
    data = sleepData(timeToBed[0], timeToSleep[0], numTimesAwake[0], timeAwake[0], timeOutBed[0], timeGetOutBed[0], 
                    sleptWell[0], feelNextDay[0], hoursInBed);
    console.log(feelNextDay[0]);
    console.log(data);
})



// temp date object to test out class
let day_array = ['Tue','Web','Thur', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thur']
let month_array = ['Mar', 'Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar',]
let date_array = ['01','02','03','04','05','06','07','08','09','10'];

const zipped3 = (x, y, z) => Array(Math.max(x.length, y.length, z.length)).fill().map((_,i) => [x[i], y[i], z[i]]);


const dateOject = (day, month, date) => {
    return {days: day,
           months: month,
           dates: date}
}

let date_container = [];

for(let [i, j, k] of zipped3(day_array, month_array, date_array)) {
    date_container.push(dateOject(i, j, k))
}

console.log(date_container.dates);


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
        };
        console.log(this.elem);
    
    this.elem.prev.addEventListener("click", ()=> {
        console.log("prev button");
        let [dates, days, months] = this.getCurrentDateBounds();
        console.log(dates);
        this.setDates(dates, days, months);
    })

    this.elem.next.addEventListener("click", ()=> {
        console.log("next button");
    })}

    getCurrentDateBounds() {
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
        return [dates_container.slice(minIdx-1, maxIdx), days_container.slice(minIdx-1, maxIdx), month_container.slice(minIdx-1, maxIdx)];
    }

    setDates(dates, days, months) {
        const elems = [this.elem.dt1, this.elem.dt2, this.elem.dt3, this.elem.dt4, this.elem.dt5, this.elem.dt6, this.elem.dt7];
        const zipped = (x, y, z, a) => Array(Math.max(x.length, y.length, z.length, 
                                                a.length)).fill().map((_,i) => [x[i], y[i], z[i], a[i]]);

        for(let [i, j, k, w] of zipped(elems, dates, days, months)) {
            i.querySelector(".dt-number").innerHTML = j;
            i.querySelector(".dt-text").innerHTML = `${k} ${w}`;
        };

    }


};

let dateSlider = new DateSlider(datesContainer, date_container);