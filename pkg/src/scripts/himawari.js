"use strict";

async function downloadLatest() {
    const
        [hours, minutes] = calcDate(),
        hoursFormatted   = ("0" + hours).slice(-2),
        minutesFormatted = ("0" + minutes).slice(-2),
        url = `https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__trm_${hoursFormatted}${minutesFormatted}.jpg`
    ;

    console.log("calculated date", hoursFormatted, minutesFormatted);

    return await fetch(url).then((response) => response.blob());
}


function calcDate() {
    const
        now     = new Date(),
        hours   = now.getHours(),
        minutes = now.getMinutes()
    ;
    return [hours - 10, minutes - (minutes % 10)];
}


