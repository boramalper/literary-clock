"use strict";

document.addEventListener("DOMContentLoaded", function () { (async () => {
    // https://stackoverflow.com/a/39027151/4466589
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (;;) {
        try {
            console.log("Downloading latest image...");

            const
                [blob, time] = await downloadLatest(),
                data         = await(encode(blob))
            ;

            await chrome.storage.local.set({
                "earth": {
                    data   : data,
                    utcTime: time,
                }
            });

            console.log("Downloaded latest image!");

            await sleep(10 * 60 * 1000);
        } catch(err) {
            console.error("Background Error", err);
            await sleep(1 * 60 * 1000);  // Wait a minute before retrying
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
