"use strict";

const FLICKR_API_KEY = "d020064bfe2204369e6c5d36203d9e2f";

/**
 * flickrSearch
 *
 * https://www.flickr.com/services/api/flickr.photos.search.html
 *
 * @param tags
 *  A comma-delimited list of tags. You can exclude results that match a term by prepending it with a - character.
 * @param minUploadDate
 *  The date can be in the form of a unix timestamp or mysql datetime (e.g. 2018-08-08 00:00:00).
 */
async function flickrSearch(tags, minUploadDate) {
    const searchURL = urlQuery("https://api.flickr.com/services/rest/", {
        method: "flickr.photos.search",
        api_key: FLICKR_API_KEY,
        tags: tags,
        min_upload_date: minUploadDate,
        sort: "interestingness-desc",
        safe_search: "1",  // absolutely safe (i.e. not even moderate)
        content_type: "1",  // photos only (i.e. no screenshots or 'other' material)
        media: "photos",
        per_page: "10",
        format: "json",
        nojsoncallback: "1"
    });

    const response = await fetch(searchURL);
    return await response.json();
}

/***
 * flickrPhotoURL
 *
 * https://www.flickr.com/services/api/misc.urls.html
 *
 * Source URL format:
 *   https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[bhk].jpg
 *
 * Size Suffixes:
 *   b    large, 1024 on longest side
 *   h    large, 1600 on longest side
 *   k    large, 2048 on longest side
 *
 * @param photo
 * @param size
 * @returns
 */
function flickrPhotoURL(photo, size) {
    const
        farmID   = photo.farm,
        serverID = photo.server,
        id       = photo.id,
        secret   = photo.secret;

    return `https://farm${farmID}.staticflickr.com/${serverID}/${id}_${secret}_${size}.jpg`;
}

function urlQuery(url, parameters) {
    return url + "?" + Object.keys(parameters).map(function(key) {
        return key + "=" + parameters[key];
    }).join("&");
}


document.addEventListener('DOMContentLoaded', function () {
    console.log("on load!!");

    (async () => {
        try {
            console.log("searching...");
            const results = await flickrSearch("nature", "2018-08-08 00:00:00");
            console.log("search done!!", results);

            //const photo = await flickrGet(results.photos.photo[0], "h");

            document.getElementsByTagName("body")[0].style["background-image"] = 'url("' + flickrPhotoURL(results.photos.photo[0], 'h') + '")';
            console.log("set background-image!!");
        } catch(err) {
            console.log("ERROR", err);
        }
    })();
});