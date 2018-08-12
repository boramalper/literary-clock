"use strict";

// [hours, minutes]
let lastUpdated = null;


document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName === "local" && "earth" in changes) {
            redraw();
        }
    });

    redraw();
    clockLoop();
});


function clockLoop() {
    const
        now     = new Date(),
        hours   = now.getHours(),
        minutes = now.getMinutes()

    ;

    // Return early if we are still in the same HOUR:MINUTE
    if (lastUpdated && lastUpdated[0] === hours && lastUpdated[1] === minutes) {
        // don't forget to loop!
        setTimeout(clockLoop, 1 * 1000);
        return;
    }

    const
        main           = document.getElementsByTagName("main")[0],
        p              = document.querySelector("blockquote > p"),
        work           = document.querySelector("#work"),
        author         = document.querySelector("#author"),
        closestMinutes = findClosest(times, hours * 60 + minutes),
        res            = sample(tqMap[closestMinutes])
    ;

    p.innerHTML           = res.quote;
    work.innerText        = res.work;
    author.innerText      = res.author;
    main.style.visibility = "visible";

    lastUpdated = [hours, minutes];

    // loop!
    setTimeout(clockLoop, 1 * 1000);
}


function redraw() {
    chrome.storage.local.get("earth", function ({earth}) {
        if (earth === undefined) {
            console.warn("Earth is not downloaded yet!");
            return;
        }

        console.log("Earth", earth);

        const earthImg = document.getElementById("earth");
        earthImg.setAttribute("src", earth.data);
        earthImg.setAttribute("alt", "The Earth, updated on " + earth.utcTime + " UTC");
        earthImg.style.visibility = "visible";
    });
}


/**
 * Find the element in A (an array of numbers) closest to T (a number).
 *
 * @param A  array to search in
 * @param T  element to look for
 */
function findClosest(A, T) {
    // Source: https://stackoverflow.com/a/35000557
    return A.reduce((prev, curr) => Math.abs(curr - T) < Math.abs(prev - T) ? curr : prev);
}


function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
