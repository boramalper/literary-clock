"use strict";

document.addEventListener("DOMContentLoaded", function () {
    (async () => {
        try {
            get(new Date(Date.now()));
        } catch(err) {
            console.log("ERROR", err);
        }
    })();
});


// Refresh the background every 10 minutes.
setInterval(function refresh() {
    get(1);
}, 10 * 60 * 1000);
