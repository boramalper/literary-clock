"use strict";

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName !== "local")
            return;

        if (!("tiles" in changes))
            return;

        (async () => { await redraw(); })();
    });

    (async () => {
        try {
            await redraw();
        } catch(err) {
            console.log("ERROR", err);
        }
    })();
});



async function redraw() {
    chrome.storage.local.get("tiles", function (obj) {
        if (obj === undefined) {
            // TODO: display default image... tiles are not downloaded yet
            console.log("emptyyy");
            return;
        }

        const tiles = obj.tiles;
        console.log("GOT TILES!!", tiles);

        for (let Y of Array(4).keys()) {
            for (let X of Array(4).keys()) {
                const tile = document.querySelector("img#t_" + X + "_" + Y);
                tile.setAttribute("src", tiles[Y * 4 + X]);
            }
        }

    });
}