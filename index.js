
// Global variables

var storyNum = "";  // init storyNum variable to keep track of the story

var validateMenusAlertText = "" // init string for the menu alerts if values are missing



// Validates and stores participant number to add to pagesData on next page
// NOTE: not needed now, as participant number is given in dropdown menu!

//function recordParticipantNum() {
//    var participantNum = document.forms["participantNumForm"]["participantNum"].value;
//
//    if (participantNum == "") {
//        alert("Please fill in your participant number!");
//        return false;
//    } else {
//        // store the participantNum
//        localStorage.setItem("participantNum", participantNum);
//        return true;
//    }
//}



// Set up the annotation choice dropdown menu
// Code adapted from: https://jsfiddle.net/mplungjan/65Q9L/

var stateObject = { // The possible states of the dropdown menus
    "0" : {
        //"1": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
        //"9": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
        //"17": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
        "32": ["Character Features"]
    },

    "1" : {
        "32": ["Character Features"]
    },

    "2" : {
        "32": ["Character Features"]
    },

    "3" : {
        "32": ["Character Features"]
    }
}

//var stateObject = { // The possible states of the dropdown menus
//    "0" : {
//        "1": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
//        "9": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
//        "17": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
//        "32": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"]
//        }
//
////    "1" : {
////        "1": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
////        "9": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"],
////        "32": ["Page Segmentation", "Text Sections", "Character Segmentation", "Character Features"]
////        }
//}

window.onload = function() { // function to populate the cascading dropdown forms
    var participantSelector = document.getElementById("participantNumberMenu")
    var storySelector = document.getElementById("storyNumberMenu")
    var annotationSelector = document.getElementById("annotationTypeMenu")
    for (var state in stateObject) {
        participantSelector.options[participantSelector.options.length] = new Option(state, state);
    }
    participantSelector.onchange = function () {
        storySelector.length = 1; // remove all story options first
        annotationSelector.length = 1; // remove all annotation options first
        if (this.selectedIndex < 1) return; // if a participant is selected, then cool
        for (var story in stateObject[this.value]) {
            storySelector.options[storySelector.options.length] = new Option(story, story);
        }
    }
    participantSelector.onchange(); // reset in case page is reloaded
    storySelector.onchange = function () {
        annotationSelector.length = 1; // remove all annotation options first
        if (this.selectedIndex < 1) return; // if a story is selected, then cool
        var annotation = stateObject[participantSelector.value][this.value];
        for (var i = 0; i < annotation.length; i++) {
            annotationSelector.options[annotationSelector.options.length] = new Option(annotation[i], annotation[i]);
        }
    }
}






// Go to comics annotation page, with the correct story downloaded
function startAnnotation() {
    
    // Get the values from the cascading dropdown menus
    var participantNum = document.getElementById("participantNumberMenu").value;
    var storyNum = document.getElementById("storyNumberMenu").value;
    var annotationTypeSelected = document.getElementById("annotationTypeMenu");
    var annotationType = annotationTypeSelected.options[annotationTypeSelected.selectedIndex].text;
    
    //console.log("participant number: " + participantNum);
    //console.log("story number: " + storyNum);
    //console.log("annotation type: " + annotationType);
    
    // Check if all cascading menus have values, and send prompt if not
    if (participantNum == "" ) {
        validateMenusAlertText = "Please choose your particiant number from the dropdown menu.";
    }
    if (storyNum == "") {
        validateMenusAlertText = validateMenusAlertText + "\nPlease choose a story number from the dropdown menu.";
    }
    if (annotationType == "Select Annotation") {
        validateMenusAlertText = validateMenusAlertText + "\nPlease choose an annotation task from the dropdown menu.";
    }
    
    if (validateMenusAlertText != "") {
        alert(validateMenusAlertText);
    }
    validateMenusAlertText = ""; // reset once the alert is shown
    
    
    // Assign variables from the dropdown menus beyond the index page
    localStorage.setItem("participantNumKey", participantNum);
    localStorage.setItem("storyNumKey", storyNum);
    localStorage.setItem("annotationTypeKey", annotationType);
    
    // go back to the main CAT page
    location.href = 'comicsAnnotation.html';
    

    //localStorage.setItem("jsonPreloaded", true); // this is used only to check a previously annotated page - offline use!

//    var x = recordParticipantNum();
//    console.log(x);
//
//    if (x == false) {
//        return;
//    }
//    if (x == true) {
//        // go the the annotation tool with correct storyNum in place
//        location.href = 'comicsAnnotation.html'; // go back to the main annotation page
//    }
    
} // end function StartAnnotation()






