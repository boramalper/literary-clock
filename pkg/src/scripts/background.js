"use strict";

document.addEventListener("DOMContentLoaded", function () { (async () => {
    // https://stackoverflow.com/a/39027151/4466589
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (;;) {
        try {
            console.log("BACK downloading...");
            const
                blobs = await downloadLatestTiles(),
                tiles = []
            ;

            for (let i = 0; i < 16; i++)
                tiles.push(await encode(blobs[i]));

            await chrome.storage.local.set({
                "tiles": tiles
            });

            console.log("BACK SAVED!");

            await sleep(5 * 1000);
        } catch(err) {
            console.error("ERROR", err);
        }
    }

})(); });


