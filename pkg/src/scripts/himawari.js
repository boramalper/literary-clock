"use strict";

async function downloadLatest() {
    const
        [hours, minutes] = calcDate(),
        hoursFormatted   = ("0" + hours).slice(-2),
        minutesFormatted = ("0" + minutes).slice(-2),
        url = `https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__trm_${hoursFormatted}${minutesFormatted}.jpg`
    ;

    console.log("calculated date", hoursFormatted, minutesFormatted);

    return [
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.blob();
            }

            throw new Error("Could NOT download the latest image! (" + response.status + " - " + response.statusText + ")");
        }),
        hoursFormatted + ":" + minutesFormatted
    ];
}


function calcDate() {
    const
        now     = new Date(),
        hours   = now.getHours(),
        minutes = now.getMinutes()
    ;

    // Himawari-8 satellite observes the UTC+10 timezone, so to calculate which image to fetch, we subtract 10 from
    // the current time (hour) to calculate its equivalent in UTC timezone.
    //
    // To prevent "negative hours", we add 24 and mod 24.
    return [(hours - 10 + 24) % 24, minutes - (minutes % 10)];
}


