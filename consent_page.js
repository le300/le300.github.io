
// JS script for consent_page.html

var consentCheckboxes;

var consentCheck1;
var consentCheck2;
var consentCheck3;
var consentCheck4;
var consentCheck5;
var consentCheck6;

var continue_button = document.getElementById("continueButton_consentPage");


function check_all_checkboxes() {
    //console.log("loaded");
    // get all the values of all the consent form checkboxes
    consentCheck1 = document.getElementById("consentFormPart1").checked;
    consentCheck2 = document.getElementById("consentFormPart2").checked;
    consentCheck3 = document.getElementById("consentFormPart3").checked;
    consentCheck4 = document.getElementById("consentFormPart4").checked;
    consentCheck5 = document.getElementById("consentFormPart5").checked;
    consentCheck6 = document.getElementById("consentFormPart6").checked;
    
    // if all values are true, change the button color
    if (consentCheck1 == true && consentCheck2 == true && consentCheck3 == true && consentCheck4 == true && consentCheck5 == true && consentCheck6 == true) {
        //console.log("here");
        continue_button.style.opacity = 1.0;
        continue_button.style.cursor = "pointer";
        
    }
    else {
        continue_button.style.opacity = 0.6;
        continue_button.style.cursor = "not-allowed";
    }
} // end of check_all_checkboxes()


function prepare_checkboxes() {
    // gather all the consent form checkboxes
    consentCheckboxes = document.getElementsByClassName("consentCheckbox");
    // add the event listener to each consent form checkbox
    for (let i=0; i<consentCheckboxes.length; i++) {
        consentCheckboxes[i].addEventListener("onchange", check_all_checkboxes());
    }
} // end of prepare_checkboxes()


window.addEventListener('load', function() {
                        setInterval(check_all_checkboxes, 1000);
                        }, false);

document.addEventListener('DOMContentLoaded', function() {
        // The selector can be any valid CSS selector identifying the checkbox
                          prepare_checkboxes();
                          //console.log(consentCheckboxes.length); // debug
                        }, false);


