"use strict";

async function get() {
    const
        LEVEL = 4,
        WIDTH = 550,
        DATEP = strftime("%Y/%m/%d/%H%M%S", await calcDate()),  // DATE Path
        url   = `http://himawari8.nict.go.jp/img/D531106/${LEVEL}d/${WIDTH}/${DATEP}`,
        promises = []
    ;

    console.log(">>>>", await calcDate());

    for (let Y of Array(4).keys()) {
        for (let X of Array(4).keys()) {
            promises.push(
                fetch(url + `_${Y}_${X}.png`).then((response) => response.blob())
            );
        }
    }

    console.log("downloading...");
    const data = await Promise.all(promises);
    console.log("all downloaded!", data);

    for (let Y of Array(4).keys()) {
        for (let X of Array(4).keys()) {
            document.querySelector("div#e_" + X + "_" + Y + " img").setAttribute("src", await encode(data[Y * 4 + X]));
        }
    }
}


async function calcDate() {
    const
        {date} = await (await fetch("http://himawari8-dl.nict.go.jp/himawari8/img/D531106/latest.json")).json(),
        latest = Date.parse(date)  // date: %Y-%m-%d %H:%M:%S
    ;

    let offset = new Date().getTimezoneOffset();  // in minutes; must be between -12 and +10 inclusive
    if      (offset < -12 * 60) { offset = -12 * 60; }
    else if (offset > +10 * 60) { offset = +10 * 60; }

    // todo: FOR TESTING AT NIGHT
    return dateAdd(latest, "minute", 0);
    return dateAdd(latest, "minute", offset - 10);  // UTC+10:00 is the time zone that Himawari is over.
}

/**
 * Encodes a blob as base64 data URL.
 *
 * @param blob
 */
async function encode(blob) {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), "minute", 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date, interval, units) {
    let ret = new Date(date);  // don't change original date
    let checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(interval.toLowerCase()) {
        case "year"   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
        case "quarter":  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
        case "month"  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
        case "week"   :  ret.setDate(ret.getDate() + 7*units);  break;
        case "day"    :  ret.setDate(ret.getDate() + units);  break;
        case "hour"   :  ret.setTime(ret.getTime() + units*3600000);  break;
        case "minute" :  ret.setTime(ret.getTime() + units*60000);  break;
        case "second" :  ret.setTime(ret.getTime() + units*1000);  break;
        default       :  ret = undefined;  break;
    }
    return ret;
}
