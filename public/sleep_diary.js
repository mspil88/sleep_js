const dateDivs = document.getElementsByClassName("dt-number");
const prevBtn = document.getElementsByClassName("btn-prev")[0];
const datesContainer = document.getElementsByClassName("dates-container")[0];

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