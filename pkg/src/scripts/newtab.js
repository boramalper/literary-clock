"use strict";

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName === "local" && "earthData" in changes) {
            redraw();
        }
    });

    redraw();
    clockLoop();
});


function clockLoop() {
    const
        p      = document.querySelector("blockquote > p"),
        work   = document.querySelector("#work"),
        author = document.querySelector("#author")
    ;
    const
        now     = new Date(),
        hours   = now.getHours(),
        minutes = now.getMinutes(),
        closestMinutes = findClosest(times, hours * 60 + minutes)
    ;
    console.log("closest", hours, minutes, closestMinutes);

    const res = sample(tqMap[closestMinutes]);
    console.log("res", res);

    p.innerHTML      = res.quote;
    work.innerText   = res.work;
    author.innerText = res.author;

    // loop!
    setTimeout(clockLoop, 60 * 1000);
}


function redraw() {
    chrome.storage.local.get("earthData", function ({earthData}) {
        if (earthData === undefined) {
            console.warn("Earth is not downloaded yet!");
            return;
        }

        const earth = document.getElementById("earth");
        earth.setAttribute("src", earthData);
        earth.style.visibility = "visible";
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
