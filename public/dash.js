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
        xAxis.push(i.diaryDate);
        yAxis.push(Number(i.sleepEfficiencyScore));
    }
    return [xAxis, yAxis]
}

const sortByDate = (a, b) => {
    let dateA = new Date(a.diaryDate + "2022");
    let dateB = new Date(b.diaryDate + "2022");
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

const diaryTableFilter = (sleepData, weekIndexFilt) => {
    return sleepData.filter((item) => item.weekIndex === weekIndexFilt);
}

let currentWeekIdx = 0;
let maximumWeekIdx = 0;

const prevWeekBtn = document.querySelector(".fa-angle-double-left");
const nextWeekBtn = document.querySelector(".fa-angle-double-right");

prevWeekBtn.addEventListener("click", ()=> {
    
    if(currentWeekIdx > 0) {
        const newWeekIndex = currentWeekIdx - 1;
        currentWeekIdx = newWeekIndex;
        const filt = diaryTableFilter(mySleepData, newWeekIndex)
        filt.sort(sortByDate);
        renderDiaryTable(filt, diaryTbl);
        
    }
})


nextWeekBtn.addEventListener("click", ()=> {
    console.log("next");
    if(currentWeekIdx <= maximumWeekIdx) {
        const newWeekIndex = currentWeekIdx + 1;
        currentWeekIdx = newWeekIndex;
        const filt = diaryTableFilter(mySleepData, newWeekIndex)
        filt.sort(sortByDate);
        renderDiaryTable(filt, diaryTbl);
        
    }
})


const plotSleepData = async() => {
    
    let sleepData = await getSleepData().then((res)=> {
        res.sleep.forEach(itm=> mySleepData.push(itm));
        console.log(res.sleep);
        const maxWeekIdx = maxWeek(res.sleep);
        currentWeekIdx = maxWeekIdx;
        maximumWeekIdx = maxWeekIdx;
        console.log(maxWeekIdx);
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

plotSleepData();

