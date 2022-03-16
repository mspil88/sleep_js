const dateDivs = document.getElementsByClassName("dt-number");
const prevBtn = document.getElementsByClassName("btn-prev")[0];
const datesContainer = document.getElementsByClassName("dates-container")[0];

let date_array = ['01','02','03','04','05','06','07','08','09','10'];

console.log(datesContainer);

const getCurrentDates = () => {
    let dates = []
    for(const i of dateDivs) {
        dates.push(i.innerHTML);
    }
    return [dates[0], dates[dates.length-1]];
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
        };
        console.log(this.elem);
    
    this.elem.prev.addEventListener("click", ()=> {
        console.log("prev button");
        let dates = this.getCurrentDateBounds();
        console.log(dates);
        this.setDates(dates);
    })

    this.elem.next.addEventListener("click", ()=> {
        console.log("next button");
    })}

    getCurrentDateBounds() {
        this.currentDates = [this.elem.dt1.querySelector(".dt-number").innerHTML, this.elem.dt7.querySelector(".dt-number").innerHTML];
        const [_min, _max] = this.currentDates;
        const minIdx = this.dateObj.indexOf(_min);
        const maxIdx = this.dateObj.indexOf(_max);
        return this.dateObj.slice(minIdx-1, maxIdx);
    }

    setDates(dates) {
        const elems = [this.elem.dt1, this.elem.dt2, this.elem.dt3, this.elem.dt4, this.elem.dt5, this.elem.dt6, this.elem.dt7];
        const zipped = (x, y) => Array(Math.max(x.length, y.length)).fill().map((_,i) => [x[i], y[i]]);

        for(let [i, j] of zipped(elems, dates)) {
            i.querySelector(".dt-number").innerHTML = j;
        };

    //     for(let i of elems) {
    //         for(let j of dates) {
    //             i.querySelector(".dt-number").innerHTML = j;
    //     }
    // }
    }


};

let dateSlider = new DateSlider(datesContainer, date_array);