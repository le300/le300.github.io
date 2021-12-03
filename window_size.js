
// JS for display window size on page_1

var screenWidth;
var screenHeight;
var continue_button_page1 = document.getElementById("continueButton");


function displayWindowSize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    var browserSizeDisplay = document.getElementById("browserSizeDisplay");
    browserSizeDisplay.innerHTML = "Your browser size: " + screenWidth + " x " + screenHeight;
} // end of displayWindowSize


function windowSizeCheck() {
    // make sure the screen in 1300 x 700 pixels
    if (screenWidth >= 1300 && screenHeight >= 700) {
        continue_button_page1.style.opacity = 1.0;
        continue_button_page1.style.cursor = "pointer";
        continue_button_page1.onclick = function nav(){ location.href = "info_page.html";
        };
    }
    else {
        continue_button_page1.style.opacity = 0.6;
        continue_button_page1.style.cursor = "not-allowed";
        continue_button_page1.onclick = "";
    }
    
} // end of windowSizeCheck



window.onload = function(e) {
    displayWindowSize();
    windowSizeCheck();
}
window.onresize = function(e) {
    displayWindowSize();
    windowSizeCheck();
}





