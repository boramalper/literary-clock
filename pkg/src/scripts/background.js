"use strict";

document.addEventListener("DOMContentLoaded", function () { (async () => {
    // https://stackoverflow.com/a/39027151/4466589
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (;;) {
        try {
            console.log("Downloading latest image...");

            const
                blob = await downloadLatest(),
                data = await(encode(blob))
            ;

            await chrome.storage.local.set({
                "earthData": data
            });

            console.log("Downloaded latest image!");

            await sleep(10 * 60 * 1000);
        } catch(err) {
            console.error("ERROR", err);
        }
    }

})(); });

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
