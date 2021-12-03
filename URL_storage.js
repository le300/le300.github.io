

// URL storage


var URL;
//var subject_id;


function init() {
    console.log("init fired");
    // Get Prolific ID and other information
    URL = window.location.href; // get full URL of the first webpage
    console.log(URL);
    localStorage.setItem("URL", URL);
}

document.addEventListener("DOMContentLoaded", init);
