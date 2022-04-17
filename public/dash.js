const chart = document.querySelector(".sef-hours-trend");
const sefColor = 'rgb(218,165,32)';
const sefTarget = 70;
const targetColor = 'rgb(219,112,147)';
let targetYaxis = [];

const layout = {
    autosize: true,

    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend:false,
    title: {
        text: '<b>Sleep Efficiency Over Time</b>',
        font: {
            color: "#FFFFFF",
            size: 18
        },
    },
    yaxis: {color: '#FFFFFF',
            range: [0, 100],
            gridcolor: "rgba(255, 255, 255, 0.3)"},
    xaxis: {
        color: '#FFFFFF',
        gridcolor: "rgba(255, 255, 255, 0.3)",
        autorange: true,
        tickfont: {
            size: 10,
        },
        rangeselector: {buttons: [
               {count: 1,
                label: '1m',
                step: 'month',
                stepmode: 'backward'
               },
            {step: 'all'}
            ]}

        }
    };

const createPlotlyTrace = (x, y, color, name, lineWidth, fill=true) => {
    
    tr = {
        x: x,
        y: y,
        mode: 'bar',
        name: name,
        fill: 'tozeroy',
        line: {shape: 'spline',
               color: color,
               width: lineWidth},
        type: 'scatter'
    }

    if(fill) {
        tr.fill = "tozeroy"
    }

    return tr;
}


const getSleepData = async() => {
    const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
    let sleepData = await axios.get("api/v1/sleep", config);
    return sleepData.data;
}



const getAxes = (data) => {
    let xAxis = [];
    let yAxis = [];
    for(let i of data){
        xAxis.push(i.diaryDate.slice(0, 10));
        yAxis.push(Number(i.sleepEfficiencyScore));
    }
    return [xAxis, yAxis]
}

const sortByDate = (a, b) => {
    let dateA = new Date(a.diaryDate);
    let dateB = new Date(b.diaryDate);
    return dateA > dateB ? 1: -1;
}

const renderCardData = () => {
    return
}

const plotlyConfig = {resposive: true};

const plotSefData = async (result) => {
    let data = result.sleep;
    data.sort(sortByDate);
    const [sefX, sefY] = getAxes(data);
    const sefTrace = [createPlotlyTrace(sefX, sefY, sefColor, 'SEF score', 2, fill=false)];
    Plotly.newPlot(chart, sefTrace, layout, plotlyConfig);
    return result

}



const renderDiaryTable = (res, tableContainer) => {
    
    let rowIdx = 0;
    let tbl = `<table class="my-diary-table">
                <tr>
                    <th>Date</th>
                    <th>In Time</th>
                    <th>Out of Bed</th>
                    <th>Hours Asleep</th>
                    <th>Sleep Efficiency</th>
                    <th>How I slept</th>
                    `
    for(let i of res) {
        tbl += `<tr class="row_${rowIdx}">
                    <td>${i.diaryDate}</td>
                    <td>${i.bedTime}</td>
                    <td>${i.timeGotOutBed}</td>
                    <td>${i.hoursSpentAsleep}</td>
                    <td>${i.sleepEfficiencyScore}</td>
                    <td>${i.qualityOfSleep}</td>
        `
        rowIdx ++;
    }
    tbl += `</table>`;
    tableContainer.innerHTML = tbl;
    return
}

const plotFeelings = () => {
    return
}

const diaryTbl = document.querySelector(".diary-table-container");

let mySleepData = [];


const maxWeek = (sleepData) => {
    let _max = 0;
    sleepData.forEach((item)=> {
        if(item.weekIndex > _max) {
            _max = item.weekIndex
        }
    })
    return _max;
}

const minWeek = (sleepData) => {
    let _min = 0;
    sleepData.forEach((item)=> {
        if(item.weekIndex < _min) {
            _min = item.weekIndex;
        }
    })
    return _min;
}

const diaryTableFilter = (sleepData, weekIndexFilt) => {
    return sleepData.filter((item) => item.weekIndex === weekIndexFilt);
}

let currentWeekIdx = 0;
let maximumWeekIdx = 0;
let minimumWeekIdx = 0;

const prevWeekBtn = document.querySelector(".fa-angle-double-left");
const nextWeekBtn = document.querySelector(".fa-angle-double-right");

prevWeekBtn.addEventListener("click", ()=> {
    
    if(currentWeekIdx >= minimumWeekIdx) {
        const newWeekIndex = currentWeekIdx - 1;
        console.log(newWeekIndex);
        currentWeekIdx = newWeekIndex;
        const filt = diaryTableFilter(mySleepData, newWeekIndex)
        filt.sort(sortByDate);
        renderDiaryTable(filt, diaryTbl);
        
    }
})


nextWeekBtn.addEventListener("click", ()=> {
    console.log("next");
    if(currentWeekIdx < maximumWeekIdx) {
        const newWeekIndex = currentWeekIdx + 1;
        currentWeekIdx = newWeekIndex;
        const filt = diaryTableFilter(mySleepData, newWeekIndex)
        filt.sort(sortByDate);
        renderDiaryTable(filt, diaryTbl);
        
    }
})

const aggregateSleepEfficiency = (sleepData, weekIdx) => {
    let prevHoursSlept = 0;
    let prevHoursInBed = 0;
    let currHoursSlept = 0;
    let currHoursInBed = 0;

    for(let i of sleepData) {
        if(i.weekIndex === weekIdx) {
            currHoursSlept += i.hoursSpentAsleep;
            currHoursInBed += i.hoursSpentInBed;
        }
        else if(i.weekIndex === weekIdx-1) {
            prevHoursSlept += i.hoursSpentAsleep;
            prevHoursInBed += i.hoursSpentInBed;
        }
    }

    let currSef = Math.ceil((currHoursSlept/currHoursInBed)*100)
    let prevSef = Math.ceil((prevHoursSlept/prevHoursInBed)*100)

    let changeOnPrevious = currSef - prevSef;

    return [currSef, changeOnPrevious];
}

const aggregateHoursSlept = (sleepData, weekIdx) => {
    let prevHoursSlept = 0;
    let currHoursSlept = 0;
    let prevDays = 0;
    let currDays = 0;

    for(let i of sleepData) {
        if(i.weekIndex === weekIdx) {
            currDays ++;
            currHoursSlept += i.hoursSpentAsleep
        }
        else if(i.weekIndex === weekIdx-1) {
            prevDays ++;
            prevHoursSlept += i.hoursSpentAsleep
        }
    }

    let currAvgHours = Math.ceil(currHoursSlept/currDays);
    let prevAvgHours = Math.ceil(prevHoursSlept/prevDays);
    console.log("hours sleep fn")
    console.log(prevHoursSlept, prevDays);
    let changeOnPrevious = currAvgHours - prevAvgHours;

    return [currAvgHours, changeOnPrevious];
}

const sefScore = document.querySelector(".sef-score");
const sefChange = document.querySelector(".sef-change");
const hoursScore = document.querySelector(".hours-score");
const hoursChange = document.querySelector(".hours-change");

const getMoodData = async() => {
    const config  = {headers: {Authorization:  `Bearer ${localStorage.getItem("token")}`}};
    const data = await axios.get("api/v1/mood", config);
    return data.data;
}

const cardChange = (score, card) => {
    
    let returnValue = score > 0 ? `▲ ${score}`
                        : score === 0 ?`  ${score}`
                        : `▼ ${score}`

    if(card === "sef") {
        returnValue += "pp"
    } else if(card === "hours") {
        returnValue += " hours"
    } else {
        returnValue += " points"
    }

    return returnValue;
}

//refactor to not use then
const plotSleepData = async() => {
    

    let sleepData = await getSleepData().then((res)=> {
        res.sleep.forEach(itm=> mySleepData.push(itm));
        console.log(res.sleep);
        const maxWeekIdx = maxWeek(res.sleep);
        minimumWeekIdx = maxWeekIdx;
        const minWeekIdx = minWeek(res.sleep);
        console.log(`min week ${minWeekIdx}`)
        currentWeekIdx = maxWeekIdx;
        maximumWeekIdx = maxWeekIdx;
        
        let [currentSef, sefChangeOnPrev] = aggregateSleepEfficiency(res.sleep, maxWeekIdx);
        let [currentHoursSleep, hoursSleptChangeOnPrev] = aggregateHoursSlept(res.sleep, maxWeekIdx);
        sefScore.textContent = `${currentSef}%`;
        console.log("SEF CHANGE")   
        console.log(sefChangeOnPrev);
        sefChange.textContent = cardChange(sefChangeOnPrev, "sef");
        hoursScore.textContent = `${currentHoursSleep}`
        hoursChange.textContent = cardChange(hoursSleptChangeOnPrev, "hours");
        
       
        const filt = diaryTableFilter(mySleepData, maxWeekIdx)
        filt.sort(sortByDate);
        plotSefData(res);
        renderDiaryTable(filt, diaryTbl);
        //renderDiaryTable(res.sleep.slice(res.sleep.length-7, res.sleep.length), diaryTbl);
        
        console.log(res);
    })
    .catch((error)=> {
        console.log(error);
    })

    
    // sleepData.sort(sortByDate);
    // let data = sleepData.sleep;
    // data.sort(sortByDate);
    // const [sefx, sefy] = getAxes(data);
    
    // const sefTrace = [createPlotlyTrace(sefx, sefy, sefColor, 'SEF score', 2, fill=false)];
    // Plotly.newPlot(chart, sefTrace, layout, plotlyConfig);


}

const anxietyScore = document.querySelector(".anxiety-score");
const anxietyChange = document.querySelector(".anxiety-change");
const depressionScore = document.querySelector(".depression-score");
const depressionChange = document.querySelector(".depression-change");

//redo this so it can be generically applied above
const sortDate = (a, b) => {
    let dateA = new Date(a.createdAt);
    let dateB = new Date(b.createdAt);
    return dateA > dateB ? 1: -1;
}

const scoreDifference = (s1, s2) => {
    return s1 - s2
}

const displayMoodData = async () => {
    let moodData = await getMoodData().then((res)=> {
        console.log("MOOD DATA")
        let [prevMood, currentMood] = res.mood.slice(res.mood.length-2, res.mood.length);
        const depressionDifference = scoreDifference(currentMood.depression, prevMood.depression);
        const anxietyDifference = scoreDifference(currentMood.anxiety, prevMood.anxiety);
        depressionScore.textContent = currentMood.depression;
        anxietyScore.textContent = currentMood.anxiety;
        depressionChange.textContent = cardChange(depressionDifference, "mood");
        anxietyChange.textContent = cardChange(anxietyDifference, "mood");
    })
}

plotSleepData();
displayMoodData();
