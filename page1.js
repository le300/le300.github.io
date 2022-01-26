
// JS for Page 1

// Initialise Global Variables

var storyNum;
var annotationType;
var participantNum;


var continue_button_info_page = document.getElementById("continueButton_infoPage");

//var download_link = document.getElementsByTagName("a");
//download_link.addEventListener('click', checkInfoPageDownloaded, false);



function nextPage(nav) {
    /* Function used for the continue buttons on
        page1.html, info_page.html, and consent_page.html
        nav - a string indicating where the button should lead
     */
    
    // go back to page specified by nav
    location.href = nav;
} // end of nextPage()


function checkInfoPageDownloaded() {
    continue_button_info_page.style.opacity = 1.0;
    continue_button_info_page.style.cursor = "pointer";
    continue_button_info_page.onclick = function navigation(e){
        e.preventDefault();
        location.href = "consent_page.html"; };
} // end of checkInfoPageDownloaded()



function consentCheck() {
    /* Function that checks that all consent form checkboxes have been
        checked - of not, user is prompted to complete the consent form
        checks, and if so, the button proceeds to the next page. */

    let consentCheck1 = document.getElementById("consentFormPart1").checked;
    let consentCheck2 = document.getElementById("consentFormPart2").checked;
    let consentCheck3 = document.getElementById("consentFormPart3").checked;
    let consentCheck4 = document.getElementById("consentFormPart4").checked;
    let consentCheck5 = document.getElementById("consentFormPart5").checked;
    let consentCheck6 = document.getElementById("consentFormPart6").checked;
    //console.log(consentCheck1, consentCheck2, consentCheck3, consentCheck4, consentCheck5, consentCheck6); // Debugginz
    if (consentCheck1 == true && consentCheck2 == true && consentCheck3 == true && consentCheck4 == true && consentCheck5 == true && consentCheck6 == true) {
        
        // store this as evidence of a signature for consent
        var consent_check = "digital_signature";
        localStorage.setItem("consent_check_key", consent_check);

        nextPage('instructions.html'); // go to the next page
    }
    else {
        alert("Please read and confirm all elements on the consent form.");
    }
    
} // end of consentCheck()




function startPracticeAnnotation() {
    /* Function to start the practice annotation
     */
    // setup global variables to specify correct annotation task
    storyNum = 32;
    annotationType = "Background and Location";
    participantNum = 0;
    
    
    //localStorage.setItem("participantNumKey", participantNum);
    localStorage.setItem("storyNumKey", storyNum);
    localStorage.setItem("annotationTypeKey", annotationType);
    localStorage.setItem("participantNumKey", participantNum);
    
    location.href = 'comicsAnnotation.html';
} // end of startPracticeAnnotation()



function startFullAnnotation() {
    /* Function to start the practice annotation
     */
    // setup global variables to specify correct annotation task
    storyNum = 2;
    annotationType = "Background and Location";
    participantNum = 0;
    
    
    //localStorage.setItem("participantNumKey", participantNum);
    localStorage.setItem("storyNumKey", storyNum);
    localStorage.setItem("annotationTypeKey", annotationType);
    localStorage.setItem("participantNumKey", participantNum);
    
    location.href = 'comicsAnnotation.html';
} // end of startPracticeAnnotation()





