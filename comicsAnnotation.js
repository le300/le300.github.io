


/* GLOBAL VARIABLES */

// story number - defined on index page, increased on end page
var storyNum = localStorage.getItem("storyNumKey");

// Declare canvas configuration variables
var canvas, context;

// Initialize an array to hold preloaded comic page images
var comicPages = [];

// List to store data for each comic page
var pagesData = [];

// Current page the user is on
var pageNum;

// Drawing Rectangles - Variables for drawing on canvas
var isRecDown = false;
var startX, startY;
var startX_charID, startY_charID

var newPanel;  // new panel that's just been drawn for a panel position

var panelNum = 1; // ID of current panel being drawn

// Boolean whether user can draw panel ID rects on the canvas
var drawRectsON = false;

// Boolean to state whether the panel id task div is hidden or visible
var panelButtonsVisible = false;

// Boolean to state whether the last three panel id task buttons are hidden or visible
var lastThreePanelIDButtonsVisible = false;

// Create between page (previous and next page) navigation buttons
var navigationButtonsCreated = false;

// Boolean whether mouseclick for char task is on
var charIdON = false;

var newChar; // new char rectangle that's just been drawn

var newCharIndex; // variable to track the id number of the char rectangle that has been drawn

var charList = []; // keep a list of the char labels and descriptions to put into the top section of the page

var chars; // keep a list of the char labels and descriptions on the webpage

var textIdON = false; // Boolean whether mouseclick for text ID task is on

var locList = []; // keep a list of the location labels and descriptions to put into the top section

var locs; // keep a list of the location labels and deseiptions on the webpage

// Track the num panel being interacted with
var currentPanel;

// Track the current char form being created
var currentForm;

// Boolean to track whether the scroll is on or off - it's on when there are semantic forms, and off when there are not
var scrollON = false;


// Preset value for char and description inputs
const charLabelInstruction = "One variable (e.g. X1)";
const charDescriptionInstruction = "Several words (e.g. short girl)";
const charActionInstruction = "Several words (e.g. running away)";
const backgroundLabelInstruction = "One variable (e.g. L1)"
const backgroundLocationInstruction = "Several words (e.g. forest)";
const speechTextCharInstruction = "Character variable";
const textSpeechInstruction = "Associated character variable"
const otherTextInstruction = "One or two words (e.g. Title)"
const indicateCharInstructions = "";

// old indicateCharInstructions: Click on all the characters in the panel/section. Give repeated characters the same label. If the characters appears in a section more than once, indicate each appearance separately.


/* CANVAS and COMIC PAGES SETUP */
/* code references
 initializing the canvas: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
 mouse position on canvas:
 https://codepen.io/chrisjaime/pen/lcEpn?editors=1111
 */

/* INITIALIZATION of the WEBPAGE, IMAGES, and CANVAS */

/* Setup the canvas - implemented after the HTML DOM loads */
function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Add simple mouse position event listener to canvas - send to console for checking
   // canvas.addEventListener("click", function (evt) {
                            // var mousePos = getMousePos(canvas, evt);
                           //  console.log(mousePos.x + ',' + mousePos.y);
                           //  }, false);
    adjustImageSizes(); // Adjust images to fit on canvas
    console.log("image sizes readjusted");
    addCanvasEvents(); // Add event listeners for rectangle drawing tool to the canvas
}


/* Adjust image sizes for all preloaded images during init */
// At the moment, this is specific for the example image set to be 90% the size of the canvas
function adjustImageSizes() {
    for (var i=0; i < comicPages.length; i++) {
        comicPages[i].height = 680;
        comicPages[i].width = 500;
    }
}


/* Preload the comic page images and set their sizes */
function preload() {
    for (var i=0; i < preload.arguments.length; i++) {
        comicPages[i] = new Image();
        comicPages[i].src = preload.arguments[i];
        console.log("images preloaded");
    }
}


/* Preload the comic page images after the canvas is set up */
// First function called
preload(
        "comicPages/Story" + storyNum + "/Page1.jpeg",
        "comicPages/Story" + storyNum  + "/Page2.jpeg",
        "comicPages/Story" + storyNum + "/Page3.jpeg",
        "comicPages/Story" + storyNum + "/Page4.jpeg",
        "comicPages/Story" + storyNum + "/Page5.jpeg"
        );



/* Function that Gets Mouse Position - for debugging purposes */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}


/* Wait for HTML to load and then setup the canvas */
// Second function called, called after the images are preloaded
document.addEventListener("DOMContentLoaded", init);








/* COMIC PAGE PLACEMENT on CANVAS - AFTER  INITIALIZATION */

/* Put a comic page on canvas according to the sequence in comicPages and pageNum */
function putComicPageOnCanvas() {
    canvas = document.getElementById("canvas"); // Get canvas
    var new_canvas = canvas.cloneNode(true);
    // replace canvas afresh
    canvas.parentNode.replaceChild(new_canvas, canvas);
    canvas = document.getElementById("canvas"); // Get canvas
    context = canvas.getContext("2d"); // Get context of canvas
    
    console.log("All event handlers removed");
    
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw the comic page
    addCanvasEvents(); // Add event listeners for rectangle drawing tool to the canvas
}


/* Add first comic page image to the canvas, add a new entry to the list that stores all data */
function putFirstComicPageOnCanvas() {
    
    pageNum = 0;
    putComicPageOnCanvas();
    
    // Reveal the section showing the panel ID task buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
    if (lastThreePanelIDButtonsVisible) {
        lastThreePanelIDButtonsVisible = false;
        document.getElementById("clearLastRectButton").style.display = "none";
        document.getElementById("clearButton").style.display = "none";
        document.getElementById("endButton").style.display = "none";
    }
    // Change the Start Annotation button to a page number display
    var startAnnotationButton = document.getElementById("startAnnotationButton");
    startAnnotationButton.innerHTML = "Page 1 of " + comicPages.length;
    startAnnotationButton.style.cursor = "default";
    //startAnnotationButton.style.backgroundColor = "#006080";
    // Turn off the button's onlick capabilties
    startAnnotationButton.setAttribute("onclick", "true");
    //console.log("After Start Annotation Button, pageNum is " + pageNum); //test
    // Push new dict to pagesData and add empty panels list
    pagesData.push({});
    pagesData[pageNum].panels = [];
    
    // REUPLOAD an ANNOATED PAGE (offline use!)
    
    //if (localStorage.getItem("jsonPreloaded")) {
        // Check if the file is an image.
        //pagesData = put whole json data dict in here!
        
        //nextPage(event);
        //putPreviousPageOnCanvas(event);

        // outputs a javascript object from the parsed json
        //const fs = require('fs');
        
        //fs.readFile('Annotations/Participant2_Story1.json', 'utf8', (err, jsonString) => {
          //          if (err) {
            //            console.log("Error reading file from disk:", err);
              //          return;
                //    }
                  //  try {
                    //    pagesData = JSON.parse(jsonString)["pagesData"];
                //
                //    } catch(err) {
                //        console.log('Error parsing JSON string:', err);
                //    }
                //    });
    
        drawPanelInfoOnCanvas(); // Put stored panel rects on canvas
        drawCharacterInfoOnCanvas(); // Put stored char info on canvas
        drawTextSectionInfoOnCanvas(); // Put stored text section info on canvas
        
        displayCharsAndLocsSoFar(); // update the charList and locList
        
        
    //}
    
}


/* When Next Page button is pressed */
function nextPage(event) {
    // Check how the data is being stored in the console
    //for (var i=0; i < pagesData.length; i++) {
        //for (var j=0; j < pagesData[i].panels.length; j++ ) {
            //console.log(pagesData[i].panels[j]);
        //}
    //}
    // if user has forgotton to click end task when drawing panel rects, turn off the rects panel drawing and generate forms
    if (drawRectsON){
        recordRectsOFF(event);
    }
    
    // Store the current page information, panels and form
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    
    // On the current page before you move on:
    // Validate forms: Iterate through all character labels (which have been stored) and inputs to make sure that none are missing (also puts char and location information in the respective textareas)
    var errorMessage = validateInputs();
    if (errorMessage != "") {
        console.log(errorMessage);
        alert(errorMessage);
        return;
    }
    
    // Setup panel ID button situation
    if (lastThreePanelIDButtonsVisible) {
        lastThreePanelIDButtonsVisible = false;
        document.getElementById("clearLastRectButton").style.display = "none";
        document.getElementById("clearButton").style.display = "none";
        document.getElementById("endButton").style.display = "none";
    }
    
    // Put the scroll on the semantic forms section
    if (scrollON) {
        scrollON = false;
        document.getElementById("semanticFormContainer").setAttribute("class","true");
    }
    
    // Go to next page
    pageNum += 1;
    charIdON = false;  // turn off all (panel ID, char ID, text ID) event handlers
    drawRectsON = false;
    textIdON = false;
    // Check whether this is the last page. If so, reset bottom buttons
    if (pageNum == comicPages.length-1) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Last Page: Submit All Annotations";
        buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
    } else {
        // if not last one then just next page button
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Next Page";
        buttonChange.setAttribute("onclick", "nextPage(event)");
    }
    removeSemanticForms(); // Clear the panel submission forms
    putComicPageOnCanvas(); // Put next page on canvas
    
    
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotationButton").innerHTML = "Page " + pageNumTitle + " of " + comicPages.length;
    // Show the panel demarcation section with the buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // But hide all buttons but Start Task button (until Start Button pressed)
    
    
    // If this is a revisit to a page, populate with right info - elements from the stored semantic container
    if ((pageNum+1) <= pagesData.length) {
        drawPanelInfoOnCanvas();
        drawCharacterInfoOnCanvas();
        drawTextSectionInfoOnCanvas();
        
        // if there are panels, redraw the char instruction panel
        // and get rid of panel instruction form
        if (pagesData[pageNum].panels.length>0){
            
            panelButtonsVisible = false;
            document.getElementById("panelIdSection").style.display = "none";
            panelCounter(pagesData[pageNum].panels.length);
            
        }
        console.log(pagesData[pageNum]);
        console.log(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true));
        // replace semantic form container with the stored one
        var parent = document.getElementById("semanticFormContainer").parentNode;
        parent.replaceChild(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true),
                            document.getElementById("semanticFormContainer"));
        
        
    } else {
        // else if new page push new dict and add empty panels
        pagesData.push({});
        pagesData[pageNum].panels = [];
    }
    
}



/* Put the previous page on the canvas according to the current pageNum */
function putPreviousPageOnCanvas(event) {
    // First check if this is the first page in the comicPages sequence, and if so just return the function
    if (pageNum == 0) {
        return;
    }
    // If user stopped in middle of drawing panel rects, then turn off the drawing panel rects event
    if (drawRectsON){
        recordRectsOFF(event);
    }
    
    // Setup panel ID button situation
    if (lastThreePanelIDButtonsVisible) {
        lastThreePanelIDButtonsVisible = false;
        document.getElementById("clearLastRectButton").style.display = "none";
        document.getElementById("clearButton").style.display = "none";
        document.getElementById("endButton").style.display = "none";
    }
    
    // Store current semantic forms - html elements
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    
    // Show panel ID task buttons if not visible
    if (panelButtonsVisible == false) {
        panelButtonsVisible = true;
        document.getElementById("panelIdSection").style.display = "block";
    }
    
    // If going back from the last page, change the submit button back to "next page"
    if (pageNum == comicPages.length-1) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Next Page";
        buttonChange.setAttribute("onclick", "nextPage(event)");
    } 
    
    pageNum -= 1; // Decrement pageNum index
    charIdON = false;  // turn off all (panel, char and text ID) event handlers
    drawRectsON = false;
    textIdON = false;
    //console.log("Previous Page pageNum = " + pageNum); // test
    removeSemanticForms(); // Clear the semantic submission forms
    putComicPageOnCanvas(); // Put previous image on canvas
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotationButton").innerHTML = "Page " + pageNumTitle + " of " + comicPages.length;
    
   
    drawPanelInfoOnCanvas(); // Put stored panel rects on canvas
    drawCharacterInfoOnCanvas(); // Put stored char info on canvas
    drawTextSectionInfoOnCanvas(); // Put stored text section info on canvas
    
    displayCharsAndLocsSoFar(); // update the charList and locList
    
    // if there are panels, redraw the char instruction panel
    // and get rid of panel instruction form
    //console.log(pagesData[pageNum]);
    //console.log(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true));
    
    if (pagesData[pageNum].panels.length>0){
        
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
        panelCounter(pagesData[pageNum].panels.length);
    }
    
    var parent = document.getElementById("semanticFormContainer").parentNode;
    parent.replaceChild(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true),
                        document.getElementById("semanticFormContainer"));
    
    // add indicate char event handlers
    canvas.addEventListener("mousemove", function(e) {
                            drawRectangleOnCanvas_charID.handleMouseMove(e);
                            }, false);
    
    //event listener for when the canvas is first clicked
    // this should get the top part of the rectangle
    canvas.addEventListener("mousedown", function(e) {
                            drawRectangleOnCanvas_charID.handleMouseDown(e);
                            }, false);
    
    // event listener for when the mouse is released from the canvas
    // this should generate the new char semantic form
    canvas.addEventListener("mouseup", function(e) {
                            drawRectangleOnCanvas_charID.handleMouseUp(e);
                            }, false);
    
    // event listener for mouseOut
    canvas.addEventListener("mouseout", function(e) {
                            drawRectangleOnCanvas_charID.handleMouseOut(e);
                            }, false);
    
    console.log("putPreviousPageOnCanvas(event): Char ID event handers added"); // test
    
    
    // add indicate text section event handlers
    canvas.addEventListener("mousemove", function(e) {
                            drawRectangleOnCanvas_textID.handleMouseMove(e);
                            }, false);
    
    //event listener for when the canvas is first clicked
    // this should get the top part of the rectangle
    canvas.addEventListener("mousedown", function(e) {
                            drawRectangleOnCanvas_textID.handleMouseDown(e);
                            }, false);
    
    // event listener for when the mouse is released from the canvas
    // this should generate the new char semantic form
    canvas.addEventListener("mouseup", function(e) {
                            drawRectangleOnCanvas_textID.handleMouseUp(e);
                            }, false);
    
    // event listener for mouseOut
    canvas.addEventListener("mouseout", function(e) {
                            drawRectangleOnCanvas_textID.handleMouseOut(e);
                            }, false);
    
    console.log("putPreviousPageOnCanvas(event): Text ID event handers added"); // test
}




/* Put the inputted character and location labels and descriptions on the webpage, so the user has a list of what they have already indicated */
function displayCharsAndLocsSoFar() {
    
    // Update charList shown on webpage:
    // Get a list of the li elements that are already listed on the webpage.
    //chars = document.querySelectorAll(".cList li");
    chars = document.getElementById("characterList");
    
    // remove all the elements on the chars list (list on the webpage)
    while (chars.firstChild) {
        chars.removeChild(chars.lastChild);
    }
    
    // put all the charList elements on the webpage
    for (var c=0; c<charList.length; c++) {
        var newListElement = document.createElement("Li");
        var newTextNode = document.createTextNode(charList[c]); // put charList value as a text node
        newListElement.appendChild(newTextNode);
        document.getElementById("characterList").appendChild(newListElement);
    }
    
    locs = document.getElementById("locationList");
    
    // remove all the elements on the chars list (list on the webpage)
    while (locs.firstChild) {
        locs.removeChild(locs.lastChild);
    }
    
    // if there are no elements in the list...
        // put all the charList elements on the webpage
    for (var loc=0; loc<locList.length; loc++) {
        //console.log(locList[loc]); //test
        var newLocListElement = document.createElement("Li");
        var newLocTextNode = document.createTextNode(locList[loc]);
        newLocListElement.appendChild(newLocTextNode);
        document.getElementById("locationList").appendChild(newLocListElement);
    }
    //console.log("charList: " + charList); //test
    //console.log("locList: " + locList); //test
}





/* Check all inputs when moving to the next page - check for missed inputs and give the appropriate message, and update the charList and locList */
function validateInputs() {
    //  Returns boolean and a warning string
    // Go through each input on the semantic forms to check that they are filled in
    // for now if json preloaded don't check annotations
    //if (localStorage.getItem("jsonPreloaded")) {
        //return "";
    //}
    var errorMessage = "";
    
    //console.log(pagesData); //test
    
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var panel = pagesData[pageNum].panels[i];
        //console.log(panel); //test
        for (var j=0; j<panel.characters.length; j++) {
            // whatever is in the input box for the label, make that the character label
            //console.log("i = " + i + " j = " + j);
            
            // Char Checks:
            panel.characters[j].label = document.getElementById("charFormInput" + i + "." + j).value;
            var character = panel.characters[j];
            
            if (character.label == "" || character.label == charLabelInstruction ) {
                errorMessage += "Missing Character Label for Section " + (i + 1) + " Character Number " + (j + 1) + "\n"; // send message
                document.getElementById("charFormInput" + i + "." + j).style.backgroundColor = "LightPink"; // highlight input
            }

            var characterDescriptionInput = document.getElementById("charDescriptionInput" + i + "." + j).value;
            if (characterDescriptionInput == "" || characterDescriptionInput == charDescriptionInstruction) {
                errorMessage += "Missing Character Description for Section " + (i + 1) + " Character Number " + (j + 1) + "\n"; // send message
                document.getElementById("charDescriptionInput" + i + "." + j).style.backgroundColor = "LightPink"; // highlight input
                
            } else {
                // valid description
                pagesData[pageNum].panels[i].characters[j].Description = characterDescriptionInput; // put the data into pagesData
                
                // add the char label and description to the list of characters in the story (if it is not already on the list)
                // get the char label: description
                var charLabel = document.getElementById("charFormInput" + i + "." + j).value;
                var charLabelAndDescription = charLabel + ": " + characterDescriptionInput;
            
                // check that the char label and description is in the charList
                if (charList.includes(charLabelAndDescription)) {
                    // if it is on the list, move on
                    //console.log("Char already on list"); //test
                } else {
                    // if it isn't in the charList, put it on there...
                    charList.push(charLabelAndDescription);
                    // and put it on the html character list
                }
                //console.log("charList: " + charList);
            }
            
            var characterActionInput = document.getElementById("charActionInput" + i + "." + j).value;
            //console.log("characterActionInput: " + characterActionInput); //test
            if (characterActionInput == "" || characterActionInput == charActionInstruction) {
                errorMessage += "Missing Character Action for Section " + (i + 1) + " Character Number " + (j + 1) + "\n"; // send message
                document.getElementById("charActionInput" + i + "." + j).style.backgroundColor = "LightPink"; // highlight input
            } else {
                //console.log("characterActionInput: " + characterActionInput); //test
                pagesData[pageNum].panels[i].characters[j].Action = characterActionInput;
                //console.log("Data in the pageData: " + pagesData[pageNum].panels[i].characters[j].Action); //test
            }
        }
        
        
        // Text Sections Checks:
        for (var j=0; j<panel.textSections.length; j++) {
        
            var narrationTextSectionButtonChecked = document.getElementById("narrationTextSection" + i + "." + (j+1)).checked;
            var speechTextSectionButtonChecked = document.getElementById("speechTextSection" + i + "." + (j+1)).checked;
            var otherTextSectionButtonChecked = document.getElementById("otherTextSection" + i + "." + (j+1)).checked;
            if (!(narrationTextSectionButtonChecked || speechTextSectionButtonChecked || otherTextSectionButtonChecked)) {
                errorMessage += "Missing Text Section Choice for Section " + (i +1) + " Text Section " + (j +1) + "\n"; // send message
                document.getElementById("textSectionNumberLabel" + i + "." + (j+1)).style.backgroundColor = "LightPink"; // highlight input
            }
            //console.log("Text box number: " + i + (j+1)); //test
            
            if (speechTextSectionButtonChecked) {
                var textSpeechFormInputValue = document.getElementById("textSpeechFormInput" + i + "." + (j+1)).value;
                if (textSpeechFormInputValue == "" || textSpeechFormInputValue == textSpeechInstruction) {
                    errorMessage += "Missing Speech/Thought Character for Section " + (i+1) + " Text Section " + (j+1) + "\n"; // send message
                    document.getElementById("textSpeechFormInput" + i + "." + (j+1)).style.backgroundColor = "LightPink"; // highlight input
                } else {
                    pagesData[pageNum].panels[i].textSections[j].type = "Speech/Thought: " + textSpeechFormInputValue;
                }
                console.log("Speech/Thought: " + pagesData[pageNum].panels[i].textSections[j].type); //test
            }
            if (otherTextSectionButtonChecked) {
                var otherFormInputValue = document.getElementById("otherFormInput" + i + "." + (j+1)).value;
                if (otherFormInputValue == "" || otherFormInputValue == otherTextInstruction) {
                    errorMessage = "Missing Other Description for Section " + (i+1) + " Text Section " + (j+1) + "\n"; // send message
                    document.getElementById("otherFormInput" + i + "." + (j+1)).style.backgroundColor = "LightPink"; // highlight input
                } else {
                    pagesData[pageNum].panels[i].textSections[j].type = "Other: " + otherFormInputValue;
                }
            }
            if (narrationTextSectionButtonChecked) {
                pagesData[pageNum].panels[i].textSections[j].type = "Narration";
            }
            //console.log("Check: " + pagesData[pageNum].panels[i].textSections[j].type); //test

        }
        
        // Background Sections Checks:
        var backgroundLocationLabelVariableInput = document.getElementById("backgroundLocationLabelInput" + (i + 1)).value;
        if (backgroundLocationLabelVariableInput == "" || backgroundLocationLabelVariableInput == backgroundLabelInstruction) {
            errorMessage += "Missing Background Location Label for Panel " + (i + 1) + "\n" // send message
            document.getElementById("backgroundLocationLabelInput" + (i+1)).style.backgroundColor = "LightPink"; // highlight input
        } else {
            pagesData[pageNum].panels[i].background.label = backgroundLocationLabelVariableInput;
        }
        
        var backgroundLocationDescriptionInput = document.getElementById("backgroundLocationInput" + (i + 1)).value;
        if (backgroundLocationDescriptionInput == "" || backgroundLocationDescriptionInput == backgroundLocationInstruction) {
            errorMessage += "Missing Background Location Description for Panel " + (i + 1) + "\n"; // send message
            document.getElementById("backgroundLocationInput" + (i+1)).style.backgroundColor = "LightPink"; // highlight input
        } else {
            pagesData[pageNum].panels[i].background.location = backgroundLocationDescriptionInput;
            
            // add the background description label and description to the list of locations in the story (if it is not already on the list)
            // get the location label: description
            var locationLabelAndDescription = backgroundLocationLabelVariableInput + ": " + backgroundLocationDescriptionInput;
            //console.log(locationLabelAndDescription); //test
            
            // check that the location label and description is in the locationList
            if (locList.includes(locationLabelAndDescription)) {
                // if it is on the list, move on
                // console.log("Location already on list"); //test
            } else {
                // if it isn't in the charList, put it on there...
                locList.push(locationLabelAndDescription);
                // and put it on the html location list
            }
            //console.log("locList length: " + locList.length); //test
        }
        
        var backgroundEmptyButtonChecked = document.getElementById("blankBackgroundButton" + (i + 1)).checked;
        var backgroundDetailedButtonChecked = document.getElementById("detailedBackgroundButton" + (i + 1)).checked;
        var backgroundTextButtonChecked = document.getElementById("textBackgroundButton" + (i + 1)).checked;
        if (!(backgroundEmptyButtonChecked || backgroundDetailedButtonChecked || backgroundTextButtonChecked)) {
            errorMessage += "Missing Empty/Detailed/Text Only Background Choice for Panel " + (i + 1) + "\n"; // send message
            document.getElementById("blankBackgroundButtonLabel" + (i+1)).style.backgroundColor = "LightPink"; // highlight input
            document.getElementById("detailedBackgroundButtonLabel" + (i+1)).style.backgroundColor = "LightPink"; // highlight input
            document.getElementById("textBackgroundButtonLabel" + (i+1)).style.backgroundColor = "LightPink"; // highlight input
        } else {
            pagesData[pageNum].panels[i].background.detail = backgroundDetailedButtonChecked;
            pagesData[pageNum].panels[i].background.textOnly = backgroundTextButtonChecked;
            //console.log("Check textOnly var: " + pagesData[pageNum].panels[i].background.textOnly); // test
            //console.log("Check Detail var: " + pagesData[pageNum].panels[i].background.detail); // test
        }
        
    }
    if (pagesData[pageNum].panels.length==0) {
        errorMessage = "Please draw at least one panel/section - if there are no discernable sections, just draw a rectangle around the whole page!";
        // Get rid of the Page Count and Instructions section
        document.getElementById("panelNumSection").style.display = "none";
        // Put the panel ID task buttons back
        if (panelButtonsVisible == false) {
            panelButtonsVisible = true;
            document.getElementById("panelIdSection").style.display = "block";
        }
    }

    displayCharsAndLocsSoFar(); // update the characters and locations on the webpage
    
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    console.log("Validate Forms" + errorMessage);
    return errorMessage;
}






/* DRAWING PANEL/SECTION RECTS on a COMIC IMAGE */

/* Drawing Rectangles on Comic Image for panels
 code reference: https://stackoverflow.com/questions/48144924/draw-multiple-rectangle-on-canvas
 */

// Get correct X and Y Coords
var recOffsetX, recOffsetY;

function reOffset() {
    canvas = document.getElementById("canvas");
    var BB = canvas.getBoundingClientRect();
    recOffsetX = BB.left;
    recOffsetY = BB.top;
}

// Add mouse events to canvas - used in the init function
function addCanvasEvents() {
    canvas = document.getElementById("canvas");
    
    reOffset();
    
    window.onscroll = function(e) {
        reOffset();
    }
    window.onresize = function(e) {
        reOffset();
    }
    
    drawCount = 1;

    canvas.addEventListener("mousemove", function(e) {
                           drawRectangleOnCanvas.handleMouseMove(e);
                           }, false);
    canvas.addEventListener("mousedown", function(e) {
                            drawRectangleOnCanvas.handleMouseDown(e);
                            }, false);
    canvas.addEventListener("mouseup", function(e) {
                            drawRectangleOnCanvas.handleMouseUp(e);
                            }, false);
    canvas.addEventListener("mouseout", function(e) {
                            drawRectangleOnCanvas.handleMouseOut(e);
                            }, false);
    
    console.log("addCanvasEvents: Panel ID event handers added"); // test
    
}


// Draw the stored rectangles onto the canvas element
var drawRectangleOnCanvas = {

    handleMouseDown: function(e) {
        if (!drawRectsON) {
            return;
        }
        //console.log("mouse down"); //test
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // var mousePos = getMousePos(canvas, e);
        // console.log(mousePos.x + ", " + mousePos.y); //test
        startX = parseInt(e.clientX - recOffsetX);
        startY = parseInt(e.clientY - recOffsetY);

        isRecDown = true;
    },

    handleMouseUp: function(e) {
        if (!drawRectsON) {
            return;
        }
        //console.log("mouse up"); //test
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        
        //var mousePos = getMousePos(canvas, e);
        //console.log(mousePos.x + ", " + mousePos.y); //test
        mouseX = parseInt(e.clientX - recOffsetX);
        mouseY = parseInt(e.clientY - recOffsetY);

        isRecDown = false;

        pagesData[pageNum].panels.push(newPanel); // Store created panels in the overall data structure

        drawRectangleOnCanvas.drawAll(); // Draw all panel rects when mouse dragging stops
        
        // For every rect, put a number in the top left corner on the circle
        panelNum = 1;
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var j = pagesData[pageNum].panels[i];
            context.beginPath(); // draw number in circle
            context.fillStyle = "white";
            context.font = "15px Arial Black";
            context.fillText(panelNum, j.left-10, j.top); // center into the circle
            panelNum += 1;
            //console.log(panelNum); // test
        }
    },

    drawAll: function() {
        if (!drawRectsON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("Draw function pageNum: " + pageNum); //test
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw image on canvas
        context.lineWidth = 3;
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var r = pagesData[pageNum].panels[i]; // Get all stored panel rects
            context.strokeStyle = r.color;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    
            context.beginPath(); // draw circle
            context.arc(r.left-5, r.top-5, 15, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = r.color;
            context.fill();
            
        }
    },

    handleMouseOut: function(e) {
        if (!drawRectsON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        //var mousePos = getMousePos(canvas, e);
        mouseX = parseInt(e.clientX - recOffsetX);
        mouseY = parseInt(e.clientY - recOffsetY);
    
        isRecDown = false;
    },

    handleMouseMove: function(e) {
        if (!drawRectsON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        if (!isRecDown) {
            return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        //var mousePos = getMousePos(canvas, e);
        mouseX = parseInt(e.clientX - recOffsetX);
        mouseY = parseInt(e.clientY - recOffsetY);
        // Create new panel and new storage for associated data
        newPanel = {
            left: Math.min(startX, mouseX),
            right: Math.max(startX, mouseX),
            top: Math.min(startY, mouseY),
            bottom: Math.max(startY, mouseY),
            color: "#FF0000",
            id : pagesData[pageNum].panels.length + 1,
            characters:[],
            textSections: [],
            background: {location : "",
                detail : 0,
                textOnly: 0
            }
        }
        drawRectangleOnCanvas.drawAll();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 3;
        context.globalAlpha = 1;
        context.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
    }
}



/* Draw the panel ID rects when the start button is pressed */
function recordRectsON(event) {
    //event = button click
    drawRectsON = true;
    // console.log("After Start Button, pageNum is " + pageNum); //test
    
    // change button text to red to indicate that the task event handlers are live
    document.getElementById("startButton").style.color = "#ff8080";
    
    // Get the rest of the panel ID task buttons, show them
    if (!lastThreePanelIDButtonsVisible) {
        lastThreePanelIDButtonsVisible = true;
        document.getElementById("clearLastRectButton").style.display = "inline-block";
        document.getElementById("clearButton").style.display = "inline-block";
        document.getElementById("endButton").style.display = "inline-block";
    }
}


/* Turn OFF the recordClickOnComicImage function to stop drawing panel rects on canvas, and show the Semantic Forms - one per panel */
function recordRectsOFF(event) {
    //event = button click
    drawRectsON = false; // Disable drawing panel rects on canvas
    if (panelButtonsVisible == true) {
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
    }
    
    // change button text to red to indicate that the task event handlers are live
    document.getElementById("startButton").style.color = "white";
    
    // State how many panel rectangles were drawn
    document.getElementById("panelNumSection").style.display = "block";
    panelRecNum = pagesData[pageNum].panels.length + 1;
    panelCounter(panelRecNum-1);
    showContentForms(panelRecNum-1);
    // Only create buttons at the bottom page when this function runs for the first page
    if (document.getElementById("startAnnotationButton").innerHTML == "Page 1 of " + comicPages.length && !navigationButtonsCreated) {
        createNavigationButtons();
        navigationButtonsCreated = true;
    }
    panelRecNumStored = panelRecNum;
    panelRecNum = 1;
    // Store the panel rectangle info
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        panelRectNum = i + 1;
        // Tests:
        //console.log("Panel/Section: " + panelRectNum);
        //console.log("Rectangle Coords: " + pagesData[pageNum].panels[i].left + ", " + pagesData[pageNum].panels[i].top + ", " + pagesData[pageNum].panels[i].right + ", " + pagesData[pageNum].panels[i].bottom);
    }
    //pageNum += 1;
    //console.log("After End Button, pageNum is " + pageNum); //test
}


/* Clear all the drawn panel rectangles, restart the panel rect drawing task */
function recordRectsCLEAR(event) {
    // event = button click
    // Clear the rectangles already drawn on the comic image
    putComicPageOnCanvas(); // Redraw image on canvas
    // Clear the collected panel/sections info
    pagesData[pageNum].panels = [];
}


/*  Clear just the last drawn rectangle while keeping the others */
function clearLastDrawnRectangle(event) {
    // event = button click
    // clear out the last entry in panels array
    pagesData[pageNum].panels.pop();
    // Redraw the page with the stored panels
    drawRectangleOnCanvas.drawAll();
    drawPanelInfoOnCanvas();
}




/* SEMANTIC FORM CREATION, NAVIGATION and SUBMISSION */

/*  State how many panels or sections have been identified by the user */
function panelCounter(x) {
    // Parameter x is the number of panels or sections specified by the user
    document.getElementById("panelNumSection").style.display = "inline-block"; 
    if (x==1) {
        document.getElementById("panelCount").innerHTML = "There is " + x + " section on this page.";
        return;
    }
    document.getElementById("panelCount").innerHTML = "There are " + x + " sections on this page.";
    
    // Put the scroll on the semantic forms section
    if (!scrollON) {
        scrollON = true;
        document.getElementById("semanticFormContainer").setAttribute("class","semanticFormContainerScroll");
    }
}




/* Create and Show (parts of) the form sections that need to be filled in - the number of forms that apper should be the number of panels indicated by the user */
function showContentForms(x) {
    // Parameter x in the number of panels or sections specified by the user
    // Get the standard semantic form from the html doc
    var panelForm = document.getElementById("semanticForm");
    // Create an identical form for each panel specified by the user
    for (let i=0; i<=x-1; i++) {
        var j = i+1; // Var for panel number
        // For each x in numPanels, create a clone of the semantic form
        var clone = panelForm.cloneNode(true);
        clone.setAttribute("class","semanticFormDisplay"); // Set css class for display
        clone.id = "panelForm" + j; // Change the id for the cloned form
        // Create a heading to give the panel number for the new form
        var newHeading = document.createElement("h3");
        newHeading.innerHTML = "Section " + j;
        clone.insertBefore(newHeading, clone.childNodes[0]);
        
        
        // Characters: ID and description section
        var newCharHeading = document.createElement("h4"); // Characters heading
        newCharHeading.innerHTML = "Characters";
        clone.insertBefore(newCharHeading, newHeading.nextSibling);
        
        var indicateCharButton = document.createElement("BUTTON"); // start char ID task button
        indicateCharButton.id = "indicateCharButton" + j;
        indicateCharButton.innerHTML = "Indicate Characters";
        indicateCharButton.setAttribute("onclick","startIndividualCharID(event)");
        clone.insertBefore(indicateCharButton, newCharHeading.nextSibling);
        // For the Indicate Characters button, only show it and make it available in the first section - this helps navigate the annotator to start char annotation for the first panel
        //console.log("indicateCharButton id: " + indicateCharButton.id) //test
        if (j == 1) {
            indicateCharButton.style.display = "block";
        }
        else {
            indicateCharButton.style.display = "none";
        }
        
        // Text: ID Bubbles and Blocks section
        var newTextSectionsHeading = document.createElement("h4"); // Text Sections heading
        newTextSectionsHeading.id = "newTextSectionsHeading" + j;
        newTextSectionsHeading.innerHTML = "Text Sections";
        clone.insertBefore(newTextSectionsHeading, indicateCharButton.nextSibling);
        newTextSectionsHeading.style.display = "none"; // hide until char ID task is done
        
        var indicateTextButton = document.createElement("BUTTON"); // start text ID task button
        indicateTextButton.id = "indicateTextButton" + j;
        indicateTextButton.innerHTML = "Indicate Text Boxes and Bubbles";
        indicateTextButton.setAttribute("onclick","startTextIDTask(event)");
        clone.insertBefore(indicateTextButton, newTextSectionsHeading.nextSibling);
        indicateTextButton.style.display = "none"; // hide until char ID task is done
        
        
        // Background: Label, Description, and Empty/Detailed
        var newBackgroundHeading = document.createElement("h4"); // Background heading
        newBackgroundHeading.id = "newBackgroundHeading" + j;
        newBackgroundHeading.innerHTML = "Background";
        clone.insertBefore(newBackgroundHeading, indicateTextButton.nextSibling);
        newBackgroundHeading.style.display = "none";  // keep hidden until the text ID task is done
        
        // Create background description form
        var backgroundForm = document.createElement("form"); // Form element
        backgroundForm.setAttribute('method',"post");
        backgroundForm.setAttribute('action',"true");
        backgroundForm.setAttribute('id',"backgroundForm" + j);
        backgroundForm.style.display = "none"; // keep hidden until the text ID task is done
        
        var backgroundLocationLabelInput = document.createElement("input"); //input element for location variable
        backgroundLocationLabelInput.setAttribute('type',"text");
        backgroundLocationLabelInput.setAttribute('name', "backgroundLocationLabelInput");
        backgroundLocationLabelInput.setAttribute('class', "charDescriptionInput");
        backgroundLocationLabelInput.setAttribute('id', "backgroundLocationLabelInput" + j);
        backgroundLocationLabelInput.value = backgroundLabelInstruction;
        backgroundLocationLabelInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
        backgroundLocationLabelInput.style.display = "none"; // keep hidden until the text ID task is done
        
        var backgroundLocationLabelLabel = document.createElement("label"); // label for location variable input
        backgroundLocationLabelLabel.setAttribute("for", "backgroundLocationLabel" + j);
        backgroundLocationLabelLabel.innerHTML = "Location Label:  ";
        backgroundLocationLabelLabel.setAttribute('id', "backgroundLocationLabelLabel" + j);
        backgroundLocationLabelLabel.style.display = "none"; // keep hidden until the text ID task is done
        
        var backgroundLocationInput = document.createElement("input"); //input element for location
        backgroundLocationInput.setAttribute('type',"text");
        backgroundLocationInput.setAttribute('name',"backgroundLocationInput");
        backgroundLocationInput.setAttribute("class", "locationDescriptionInput");
        backgroundLocationInput.setAttribute('id',"backgroundLocationInput" + j);
        backgroundLocationInput.value = backgroundLocationInstruction;
        backgroundLocationInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
        backgroundLocationInput.style.display = "none"; // keep hidden until the text ID task is done
        
        var backgroundLocationInputLabel = document.createElement("label"); // label for location description input
        backgroundLocationInputLabel.setAttribute("for", "backgroundLocationInput" + j);
        backgroundLocationInputLabel.innerHTML = "Location Description:  ";
        backgroundLocationInputLabel.setAttribute('id', "backgroundLocationInputLabel" + j);
        backgroundLocationInputLabel.style.display = "none"; // keep hidden until the text ID task is done
        
        var blankBackgroundButton = document.createElement("input"); // blank background radio button
        blankBackgroundButton.setAttribute("type", "radio");
        blankBackgroundButton.setAttribute("name", "backgroundDetail");
        blankBackgroundButton.setAttribute("value", "blankBackground");
        blankBackgroundButton.setAttribute('id', "blankBackgroundButton" + j);
        blankBackgroundButton.style.display = "none"; // keep hidden until the text ID task is done
        blankBackgroundButton.setAttribute("onclick", "changeBackgroundLabelToWhite()"); // add event handler
        
        var blankBackgroundButtonLabel = document.createElement("label");
        blankBackgroundButtonLabel.setAttribute("for", "blankBackground");
        blankBackgroundButtonLabel.innerHTML = "Empty";
        blankBackgroundButtonLabel.setAttribute('id', "blankBackgroundButtonLabel" + j);
        blankBackgroundButtonLabel.style.display = "none"; //keep hidden until the text ID task is done
        
        var detailedBackgroundButton = document.createElement("input"); // fully drawn background radio button
        detailedBackgroundButton.setAttribute("type", "radio");
        detailedBackgroundButton.setAttribute("name", "backgroundDetail");
        detailedBackgroundButton.setAttribute("value", "detailedBackground");
        detailedBackgroundButton.setAttribute('id', "detailedBackgroundButton" + j);
        detailedBackgroundButton.style.display = "none"; // keep hidden until the text ID task is done
        detailedBackgroundButton.setAttribute("onclick", "changeBackgroundLabelToWhite()"); // add event handler
        
        var detailedBackgroundButtonLabel = document.createElement("label");
        detailedBackgroundButtonLabel.setAttribute("for", "fullyDrawnBackground");
        detailedBackgroundButtonLabel.innerHTML = "Detailed";
        detailedBackgroundButtonLabel.setAttribute('id', "detailedBackgroundButtonLabel" + j);
        detailedBackgroundButtonLabel.style.display = "none"; // keep hidden until the text ID task is done
        
        var textBackgroundButton = document.createElement("input"); // text only background radio button
        textBackgroundButton.setAttribute("type", "radio");
        textBackgroundButton.setAttribute("name", "backgroundDetail");
        textBackgroundButton.setAttribute("value", "textBackground");
        textBackgroundButton.setAttribute('id', "textBackgroundButton" + j);
        //console.log(textBackgroundButton);
        //textBackgroundButton.setAttribute.style.display = "none"; // keep hidden until the text ID task is done
        textBackgroundButton.setAttribute("onclick", "changeBackgroundLabelToWhite()"); // add event handler
        
        var textBackgroundButtonLabel = document.createElement("label");
        textBackgroundButtonLabel.setAttribute("for", "backgroundText");
        textBackgroundButtonLabel.innerHTML = "Text Only";
        textBackgroundButtonLabel.setAttribute('id', "textBackgroundButtonLabel" + j);
        //textBackgroundButtonLabel.style.display = "none"; // keep hidden until the text ID task is done
        
        
        // Append the inputs to the form element
        backgroundForm.appendChild(backgroundLocationLabelLabel);
        backgroundForm.appendChild(backgroundLocationLabelInput);
        var breakElementX = document.createElement("br");
        backgroundForm.appendChild(breakElementX); // Add a break element between inputs
        backgroundForm.appendChild(backgroundLocationInputLabel);
        backgroundForm.appendChild(backgroundLocationInput);
        var breakElementY = document.createElement("br");
        backgroundForm.appendChild(breakElementY); // Add a break element between inputs
        backgroundForm.appendChild(blankBackgroundButton);
        backgroundForm.appendChild(blankBackgroundButtonLabel);
        backgroundForm.appendChild(detailedBackgroundButton);
        backgroundForm.appendChild(detailedBackgroundButtonLabel);
        backgroundForm.appendChild(textBackgroundButton);
        backgroundForm.appendChild(textBackgroundButtonLabel);
        
        // Append the form element to the panel form
        clone.insertBefore(backgroundForm, newBackgroundHeading.nextSibling);
        
        // Append the cloned semantic form to correct section
        document.getElementById("semanticFormContainer").appendChild(clone);
        //console.log(clone.id); //test
        
        //console.log("checking new text section " + j + " is there?" + document.getElementById("newTextSectionsHeading" + j));
    }
}



/* Create Previous Page, Reset, and Next Page Navigation buttons */
function createNavigationButtons() {
    // Create and append a button to submit all the contents of the semantic forms at once
    // Previous Page button
    var buttonPreviousPage = document.createElement("BUTTON");
    buttonPreviousPage.innerHTML = "Previous Page";
    buttonPreviousPage.setAttribute("id", "buttonPreviousPage");
    buttonPreviousPage.setAttribute("onclick","putPreviousPageOnCanvas(event)");
    buttonPreviousPage.setAttribute("class","pageNavigationButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonPreviousPage);
    
    // Reset all forms button
    var buttonReset = document.createElement("BUTTON");
    buttonReset.innerHTML = "Reset Page";
    buttonReset.setAttribute("id", "buttonReset");
    buttonReset.setAttribute("onclick", "resetPage(event)");
    buttonReset.setAttribute("class","pageNavigationButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonReset);
    
    // Next Page button
    var buttonNextPage = document.createElement("BUTTON");
    buttonNextPage.innerHTML = "Next Page";
    buttonNextPage.setAttribute("id", "buttonNextPage");
    buttonNextPage.setAttribute("class","pageNavigationButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonNextPage);
    buttonNextPage.setAttribute("onclick", "nextPage(event)");
}



/* Remove all semantic forms */
function removeSemanticForms() {
    //console.log("The number of panels stored: " + panels.length); //test
    semanticFormContainer = document.getElementById("semanticFormContainer");
    while (semanticFormContainer.firstChild) {
        semanticFormContainer.removeChild(semanticFormContainer.lastChild);
    }
    // Reset and hide the panel counter
    document.getElementById("panelNumSection").style.display = "none";
}




/* Function to reset all semantic forms */
function resetPage(event) {
    // event = click
    // Empty data stored, refresh page
    pagesData[pageNum] = {};
    pagesData[pageNum].panels = [];
    //console.log(pagesData); //test
    removeSemanticForms();
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    charIdON = false;  // turn off all (panel ID, char ID, text ID) canvas ID tasks
    drawRectsON = false;
    textIdON = false;
    
    
    // Take the scroll off the semantic forms section
    if (scrollON) {
        scrollON = false;
        document.getElementById("semanticFormContainer").setAttribute("class","true");
    }
    
    // Setup panel ID button situation
    if (lastThreePanelIDButtonsVisible) {
        lastThreePanelIDButtonsVisible = false;
        document.getElementById("clearLastRectButton").style.display = "none";
        document.getElementById("clearButton").style.display = "none";
        document.getElementById("endButton").style.display = "none";
    }
    
    putComicPageOnCanvas(); // Put next page on canvas
    
    // Add first panel task ID event listeners to the canvas
    //addCanvasEvents();
    
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";

    //console.log(pagesData);
    console.log("Page Reset");
}




/* Function to submit semantic forms */
function submitSemanticForms(event) {
    //event = click
    // Check how the data is being stored in the console
    for (var i=0; i < pagesData.length; i++) {
        for (var j=0; j < pagesData[i].panels.length; j++ ) {
            console.log(pagesData[i].panels[j]);
        }
    }
    // if user has forgotton to click end task when drawing panel rects, turn off the rects panel drawing and generate forms
    if (drawRectsON){
        recordRectsOFF(event);
    }
    // Store the current page information, panels and form
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    
    // On the current page before you move on:
    // Validate forms: Iterate through all character labels (which have been stored) and inputs to make sure that none are missing
    var errorMessage = validateInputs();
    if (errorMessage != "") {
        console.log(errorMessage);
        alert(errorMessage);
        return;
    }
    
    // GET THAT DATA!
    // Post to console
    console.log(pagesData); // test
   
    
    // Save the data to the firebase database
    sendDataToFireBase(event);

    // Lastly, go to the last webpage
    //window.location.href = "endPage.html";
}



// Submit annotated data to firebase database
function sendDataToFireBase(event) {
    //convert pagesData to a JSON file
    event.preventDefault();
    var finalData = {'pagesData' : pagesData,
        'storyID': storyNum,
        'participantNum': localStorage.getItem("participantNum")
    };
    var jsonString = JSON.stringify(finalData);
    console.log(jsonString); //test
    // use fs from Node.js to write the file to disk
    //var fs = require('fs');
    //fs.writeFile('jsonFile.json', jsonFile, 'utf8', callback);
    //db.collection("Test").add({
    //                          jsonString: jsonString
    //                          });
    
    db.collection("Annotation").add({time: Date().toLocaleString(),
                              jsonData: jsonString}
                              ).then(function(snapshot) {
                                window.location.href = "endPage.html";
                                console.log("string added");
                                });
    
 /*
    // Create a root reference
    var ref = firebase.storage().ref();
    
    // Data URL string
    var message = 'data:text/plain;' + jsonString;
    ref.putString(message, 'data_url').then(function(snapshot) {
                                            console.log('Uploaded a data_url string!');
                                            }); */
}












/* ANNOTATION and DATA SUBMISSION within SEMANTIC FORMS - Interaction and data inputs */

/* Function to start Char ID task - indicate characters with rectangles */
function startIndividualCharID(event) {
    //event = click
    
    var buttonID = event.target.getAttribute('id');
    //console.log("button name: ", buttonID); //test
    currentPanel = event.target.parentNode; // Get semantic form where button was pressed
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    //console.log("currentPanel: " + currentPanelNumber); // test
    
    // Check that the button ID matches the panel number
    // get the number of the button id
    var iDNum = getIDNum(buttonID);
    // if that equals the current panel number, then activate the char ID task. If not, just don't do a darn thing
    if (iDNum == currentPanelNumber+1) {
        //set current panel according to the button pressed
        charIdON = true;
        newCharIndex = 0; // set the char index to 0
        activateCharIDTask(event); // Turn on ability to click on the canvas
    }
    
    // turn off the button's functionality to prevent double-clicking
    document.getElementById(buttonID).setAttribute("onclick", true);
    
    // change the button color to indicate the activity is turned on
    document.getElementById(buttonID).style.color = "purple";
    
    // Add remove last char form button - just once!
    var removeLastCharFormButtonID = "removeLastCharFormButton" + currentPanelNumber;
    //boolean expression gives true if element already there, false otherwise
    var removeLastCharFormButtonCreated = !!document.getElementById(removeLastCharFormButtonID);
    // Create button when indicateCharButton clicked - only do this once per button
    //Only give instruction if not already created
    if (!removeLastCharFormButtonCreated) {
        var removeLastCharFormButton = document.createElement("BUTTON");
        removeLastCharFormButton.innerHTML = "Remove Last Character";
        removeLastCharFormButton.setAttribute("id", removeLastCharFormButtonID);
        removeLastCharFormButton.setAttribute("onclick", "removeLastCharFormButton(event)");
        currentPanel.insertBefore(removeLastCharFormButton, currentPanel.childNodes[3]);
    }
    
    // Add end char ID task button - just once!
    var endCharIDTaskButtonID = "endCharIDTaskButton" + currentPanelNumber;
    //console.log("endCharIDTaskButton id: " + endCharIDTaskButtonID); //test
    //boolean expression if element is already there, false otherwise
    var endCharIDTaskButtonCreated = !!document.getElementById(endCharIDTaskButtonID);
    // Create button when inidcateCharButton is clicked - only do this one per button
    if (!endCharIDTaskButtonCreated) {
        var endCharIDTaskButton = document.createElement("BUTTON");
        endCharIDTaskButton.innerHTML = "End Task";
        endCharIDTaskButton.setAttribute("id", endCharIDTaskButtonID);
        endCharIDTaskButton.setAttribute("onclick", "endCharIDTask(event)");
        //console.log("endCharIDTaskButton id when created: " + endCharIDTaskButton.id); //test
        currentPanel.insertBefore(endCharIDTaskButton, currentPanel.childNodes[4]);
    }

}

/* Deletes non-digit characters and leaves only the digits in the string */
function getIDNum(str) {
    var num = str.replace(/[^0-9]/g, '');
    return parseInt(num,10);
}





// Get correct X and Y Coords for the Char ID Task
// these are labelled separately from the x and y coords in the panel rectangle
// ID task
var recOffsetX_charID, recOffsetY_charID;

function reOffset_charID() {
    canvas = document.getElementById("canvas");
    var BB_charID = canvas.getBoundingClientRect();
    recOffsetX_charID = BB_charID.left;
    recOffsetY_charID = BB_charID.top;
}



/* Start Char ID Task - Function to enable dragging rectangles on the canvas */
// Puts the correct event listeners to the canvas
function activateCharIDTask(event) {
    // Add new event listener to mousedown event
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    //console.log(pagesData[pageNum].panels[0]) //test
    //console.log(pagesData[pageNum].panels[1]) //test
    
    // get the correct x and y coords for the Char ID task
    reOffset_charID();
    
    window.onscroll = function(e) {
        reOffset_charID();
    }
    window.onresize = function(e) {
        reOffset_charID();
    }
    
    
    // Add new event listeners to the canvas that allow for identifying characters
    // in rectangles
    
    // event listener for moving the mouse
    // this should show the rectangle being formed on canvas
    //var numCharactersOnPage = 0;
    
    //for (var p=0; p<pagesData[pageNum].panels.length; p++){
    //    numCharactersOnPage+=pagesData[pageNum].panels[p].characters.length;
    //}
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get
    var numCharactersInPanel = pagesData[pageNum].panels[currentPanelNumber].characters.length;
    if (numCharactersInPanel==0){  // only create if no characters exist for the page, otherwise creates too many handlers
    
        canvas.addEventListener("mousemove", function(e) {
                                drawRectangleOnCanvas_charID.handleMouseMove(e);
                                }, false);
        
        //event listener for when the canvas is first clicked
        // this should get the top part of the rectangle
        canvas.addEventListener("mousedown", function(e) {
                                drawRectangleOnCanvas_charID.handleMouseDown(e);
                                }, false);
        
        // event listener for when the mouse is released from the canvas
        // this should generate the new char semantic form
        canvas.addEventListener("mouseup", function(e) {
                                drawRectangleOnCanvas_charID.handleMouseUp(e);
                                }, false);
        
        // event listener for mouseOut
        canvas.addEventListener("mouseout", function(e) {
                                drawRectangleOnCanvas_charID.handleMouseOut(e);
                                }, false);
        
        console.log("activateCharIDTask(event): Char ID event handers added"); // test

    }

}



// CHAR RECTS
// Draw the stored rectangles onto the canvas element
var drawRectangleOnCanvas_charID = {
    
    handleMouseDown: function(e) {
        if (!charIdON) {
            return;
        }
        //console.log("mouse down for Char ID"); //test
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // var mousePos = getMousePos(canvas, e);
        // console.log(mousePos.x + ", " + mousePos.y); //test
        startX_charID = parseInt(e.clientX - recOffsetX_charID);
        startY_charID = parseInt(e.clientY - recOffsetY_charID);
        
        isRecDown = true;
    },
    
    handleMouseUp: function(e) {
        if (!charIdON) {
            return;
        }
        //console.log("mouse up"); //test
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        
        // Get which current panel number the char is in
        var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
        
        //var mousePos = getMousePos(canvas, e);
        //console.log(mousePos.x + ", " + mousePos.y); //test
        mouseX_charID = parseInt(e.clientX - recOffsetX_charID);
        mouseY_charID = parseInt(e.clientY - recOffsetY_charID);
        
        isRecDown = false;
        
        pagesData[pageNum].panels[currentPanelNumber].characters.push(newChar); // Store created char rects in the overall data structure
        
        //console.log("drawRectangleOnCanvas_charID.handleMouseUp(event) called");
        //console.log(e.target);
        //console.log(e.target.parentNode);
        //console.log(e.target.parentNode.parentNode);
//        for (var p=0; p<pagesData[pageNum].panels.length; p++) {
//            console.log("Panel: " + p);
//            for (var i=0; i<pagesData[pageNum].panels[p].characters.length; i++) {
//                console.log(pagesData[pageNum].panels[p].characters[i]); //test
//            }
//        }
        
        drawRectangleOnCanvas_charID.drawAll_charID(); // Draw all char rects for that panel when mouse dragging stops
        drawCharacterInfoOnCanvas(); // Draw all char rects that have been drawn for all chars in all panels
        drawPanelInfoOnCanvas(); //Draw all the char rects in all panels on canvas
        
        drawTextSectionInfoOnCanvas(); //Draw all the text rects in all panels on canvas
        
        // generate the semantic form associated with that char ID rect
        createCharForm();

    },
    
    drawAll_charID: function() {
        if (!charIdON) {
            return;
        }
        
        // put all the char ID rectangles on the canvas
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("Draw function pageNum: " + pageNum); //test
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw image on canvas
        context.lineWidth = 3;
        
        var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
       
        //console.log(pagesData[pageNum].panels[currentPanelNumber].characters); //test
        
        for (var i=0; i<pagesData[pageNum].panels[currentPanelNumber].characters.length; i++) {
            var q = pagesData[pageNum].panels[currentPanelNumber].characters[i]; // Get all stored character rects
            context.strokeStyle = q.color_charID;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(q.left, q.top, q.right - q.left, q.bottom - q.top);
            
            context.beginPath(); // draw circle
            context.arc(q.left, q.top, 15, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = q.color_charID;
            context.fill();
            
        }
    },
    
    handleMouseOut: function(e) {
        if (!charIdON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        //var mousePos = getMousePos(canvas, e);
        mouseX_charID = parseInt(e.clientX - recOffsetX_charID);
        mouseY_charID = parseInt(e.clientY - recOffsetY_charID);
        
        isRecDown = false;
    },
    
    handleMouseMove: function(e) {
        if (!charIdON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        if (!isRecDown) {
            return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        //var mousePos = getMousePos(canvas, e);
        mouseX_charID = parseInt(e.clientX - recOffsetX_charID);
        mouseY_charID = parseInt(e.clientY - recOffsetY_charID);
        
        // Get which current panel number the char is in
        var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
        //console.log("current panel num: " + currentPanelNumber); //test

        // Create new char element and new storage for associated data
        newChar = {
        left: Math.min(startX_charID, mouseX_charID),
        right: Math.max(startX_charID, mouseX_charID),
        top: Math.min(startY_charID, mouseY_charID),
        bottom: Math.max(startY_charID, mouseY_charID),
        color_charID: "#C942FF",
        id : pagesData[pageNum].panels[currentPanelNumber].characters.length + 1,
        label: "",
        Description: "",
        Action: ""
        }
        //console.log("currentPanel: " + currentPanelNumber); // test
        drawRectangleOnCanvas_charID.drawAll_charID();
        context.strokeStyle = "#C942FF";
        context.lineWidth = 3;
        context.globalAlpha = 1;
        context.strokeRect(startX_charID, startY_charID, mouseX_charID - startX_charID, mouseY_charID - startY_charID);
    }
}




/* Creates a char form after a new char rectangle has been created */
function createCharForm() {
    
    currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    
    // assign the index of the char form - the char index is enummerated for that particular panel
    // store the number of indicated chars
    newCharIndex = pagesData[pageNum].panels[currentPanelNumber].characters.length-1;
    
    // Create a new form object with the char number/ID
    var charForm = document.createElement("form");
    charForm.setAttribute('method',"post");
    charForm.setAttribute('action',"true");
    charForm.id = "charForm" + newCharIndex;
    charForm.setAttribute("class", "charForms");
    
    // Text input box for the character variable
    var charFormInput = document.createElement("input");
    charFormInput.setAttribute('type',"text");
    charFormInput.setAttribute('name',"characterVariable");
    charFormInput.setAttribute("class", "charFormInput"); 
    charFormInput.value = charLabelInstruction;
    charFormInput.setAttribute('id', "charFormInput"  + currentPanelNumber +  "." + newCharIndex);
    //console.log("charFormInput"  + currentPanelNumber +  "." + newCharIndex); //test
    //charFormInput.addEventListener("onchange", placeCharLabelOnCanvas, false);
    charFormInput.setAttribute('onInput', "placeCharLabelOnCanvas()"); // add event listener to put label on the canvas
    
    // Label for the character form input
    var charFormInputLabel = document.createElement("label");
    charFormInputLabel.setAttribute("for", "charFormInput" + currentPanelNumber +  "." + newCharIndex);
    charFormInputLabel.innerHTML = "Character Label: ";
    
    //console.log("char input ID: " + charFormInput.id); //test
    
    // Text input box for character description
    var charDescriptionInput = document.createElement("input");
    charDescriptionInput.setAttribute('type',"text");
    charDescriptionInput.setAttribute('name',"characterDescription");
    charDescriptionInput.value = charDescriptionInstruction;
    charDescriptionInput.setAttribute("class", "charDescriptionInput");
    charDescriptionInput.setAttribute('id', "charDescriptionInput" + currentPanelNumber + "." + newCharIndex);
    charDescriptionInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
    
    // Label for the char description form input
    var charDescriptionInputLabel = document.createElement("label");
    charDescriptionInputLabel.setAttribute("for", "charDescrptionInput" + currentPanelNumber + "." + newCharIndex);
    charDescriptionInputLabel.innerHTML = "Character Description: ";
    
    // Text input box for character action
    var charActionInput = document.createElement("input");
    charActionInput.setAttribute('type',"text");
    charActionInput.setAttribute('name', "characterAction");
    charActionInput.value = charActionInstruction;
    charActionInput.setAttribute("class", "charActionInput");
    charActionInput.setAttribute('id', "charActionInput" + currentPanelNumber + "." + newCharIndex);
    //charActionInput.style.display = "inline-block";
    charActionInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
    
    // Label for the char action form input
    var charActionInputLabel = document.createElement("label");
    charActionInputLabel.setAttribute("for", "charActionInput" + currentPanelNumber + "." + newCharIndex);
    charActionInputLabel.innerHTML = "Character Action: ";
    //charActionInputLabel.style.display = "block";
    
    // create a span element to hold the CharAction label and form and keep them in line
    var charActionSpan = document.createElement("span");
    charActionSpan.style = "white-space:nowrap";
    charActionSpan.appendChild(charActionInputLabel);
    charActionSpan.appendChild(charActionInput);
    
    
    // Append all input elements to the form element
    charForm.appendChild(charFormInputLabel); // Add the char variable form label
    charForm.appendChild(charFormInput); // Add the char form input
    //charForm.appendChild(charFormInputConfirmButton); // Add the confirm char button
    var breakElement1 = document.createElement("br");
    charForm.appendChild(breakElement1); // Put a break to separate input forms
    charForm.appendChild(charDescriptionInputLabel); // Add the char description form label
    charForm.appendChild(charDescriptionInput); // Add the char description input
    var breakElement2 = document.createElement("br");
    charForm.appendChild(breakElement2);
    charForm.appendChild(charActionSpan);
    
    // Put the char form between the "remove last character" button and "end task for this section" button
    var endCharIDTaskButton = document.getElementById("endCharIDTaskButton" + currentPanelNumber);
    //console.log(endCharIDTaskButton); //test
    //var newTextSectionHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber + 1));

    document.getElementById(currentPanel.getAttribute('id')).insertBefore(charForm, endCharIDTaskButton);
    
    // add a new char dict for this new char at end of the stored data
    //pagesData[pageNum].panels[currentPanelNumber].characters.push({label : "",
                                                                  //description : "",
                                                                  //offPanel : false
                                                                  //});
}





/* When the button endCharIDTaskButton is pressed, the char ID task on that panel ends by:
 1) switching off the event handlers and resetting the char ID task
 2) showing the rest of the form that needs to be filled out for that panel section
 3) showing the indicateChar button on the next section */
function endCharIDTask(event) {
    //console.log("endCharIDTask(event) called"); //test
    //console.log(event.target.parentNode); //test
    //console.log(event.target.parentNode.parentNode); //test
    
    // switching off the event handlers
    charIdON = false; // turn off Char ID task
    
    //numCharactersOnPage = 0; // reset num of chars
    
    // get the panel where the button was pressed
    currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    //console.log("current panel " + currentPanelNumber);
    
    // clone and replace canvas to turn off the event handlers
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    
    
    // turn on that panel's indicate char button's functionality
    // disable the previous indicateCharID button
    var indicateCharButton = document.getElementById("indicateCharButton" + (currentPanelNumber+1));
    indicateCharButton.setAttribute("onclick", "startIndividualCharID(event)");
    // change the indicate char Id button color back to show the activity is not on
    indicateCharButton.style.color = "black";
    
    // Put a line of color between the char task forms and the next text ID task
    //var endCharTaskDivider = document.createElement();
    
    // Show the next task, which is the text ID task
    var newTextSectionHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber+1)).style.display = "block"; //display the heading for the text section
    var indicateTextButton = document.getElementById("indicateTextButton" + (currentPanelNumber+1)).style.display = "inline-block"; // display the form elements for the text section
}





/* Puts the Char label on the canvas - goes with event handler for the Character Label text input */
function placeCharLabelOnCanvas() {
    //e.preventDefault(); // tell the browser we're handling this event
    var charTextInputID = event.target.getAttribute("id"); // get the input id
    //console.log("it me!! " + charTextInputID); //test
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    var inputValue = event.target.value;
    //console.log(inputValue); //test
    
    var currentCharacterID = event.target.getAttribute('id').replace("charFormInput", "");
    // Store inputValue into tha right char structure's label field
    var currentCharacterNum = (parseInt(currentCharacterID.split(".")[1]));
    //console.log(currentCharacterID.split("."));
    //console.log("current character number: " + currentCharacterNum);
    
    pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].label = inputValue;
    
    // Draw that label as white text on the associated circle on the canvas
    var xcoord = pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].left;
    var ycoord = pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].top;
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.beginPath(); // Redraw circle
    context.arc(xcoord, ycoord, 15, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "#C942FF";
    context.fill();
    context.beginPath(); // put variable in the circle
    context.fillStyle = "white";
    context.font = "15px Arial Black";
    context.fillText(inputValue, xcoord-8, ycoord+6);
    
    // change the input to white just in case the background has been highlighted after validation
    document.getElementById(charTextInputID).style.backgroundColor = "white";
}





/* Remove the last created char form and the associated rectangle */
function removeLastCharFormButton(event) {
    //event = mouse click
    
    // Remove the last created char input form
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("removeLastCharFrom Button clicked"); //test
    //console.log("currentPanel: " + currentPanelNumber); //test
    var lastCharIndex = pagesData[pageNum].panels[currentPanelNumber].characters.length-1;
    
    // remove the last char form, which is the sibling previous to the newTextSection heading
    var newTextSectionsHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber+1));
    //console.log("checking new text section " + (currentPanelNumber+1) + " is there?");
    //console.log(newTextSectionsHeading);
    
    currentPanel.removeChild(newTextSectionsHeading.previousSibling.previousSibling);
    
    // Remove last entry in panels[currentPanelNumber].characters
    pagesData[pageNum].panels[currentPanelNumber].characters.pop();
    //console.log(pagesData[pageNum].panels[currentPanelNumber].characters); //test
    
    
    var temp_charID = charIdON;  // check whether the charID task is active or not
    
    // Redraw the current canvas to get rid of old character rectangle:
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    
    if (temp_charID){ // if charIDTask was active, put event handler back
        charIdON = true;

        activateCharIDTask(event); // Turn on ability to click on the canvas
        
        // add the handlers back if over 1 character on panel
        
        //var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
        //var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get
        var numCharactersInPanel = pagesData[pageNum].panels[currentPanelNumber].characters.length;
        if (numCharactersInPanel>0){

            canvas.addEventListener("mousemove", function(e) {
                                    drawRectangleOnCanvas_charID.handleMouseMove(e);
                                    }, false);
        
            //event listener for when the canvas is first clicked
            // this should get the top part of the rectangle
            canvas.addEventListener("mousedown", function(e) {
                                    drawRectangleOnCanvas_charID.handleMouseDown(e);
                                    }, false);
        
            // event listener for when the mouse is released from the canvas
            // this should generate the new char semantic form
            canvas.addEventListener("mouseup", function(e) {
                                    drawRectangleOnCanvas_charID.handleMouseUp(e);
                                    }, false);
        
            // event listener for mouseOut
            canvas.addEventListener("mouseout", function(e) {
                                    drawRectangleOnCanvas_charID.handleMouseOut(e);
                                    }, false);
            
            console.log("removeLastCharForm: Char ID event handers added"); // test
            
        }
        
    }
    
}






// Get correct X and Y Coords for the Text ID Task
// these are labelled separately from the x and y coords in the panel rectangle
// and the char ID task - woooof... soooo many rectangles
var recOffsetX_textID, recOffsetY_textID;

function reOffset_textID() {
    canvas = document.getElementById("canvas");
    var BB_textID = canvas.getBoundingClientRect();
    recOffsetX_textID = BB_textID.left;
    recOffsetY_textID = BB_textID.top;
}



/* Initiliaze and Start Text Bubble/Blocks Task */
function startTextIDTask(event) {
    
    textIdON = true; // turn on the text ID task switch
    
    var buttonID = event.target.getAttribute('id');
    //console.log("button name: ", buttonID); //test
    
    // turn off the button's functionality to prevent double-clicking
    document.getElementById(buttonID).setAttribute("onclick", true);
    // change the button color to indicate the activity is turned on
    document.getElementById(buttonID).style.color = "green";
    
    currentPanel = event.target.parentNode; // Get semantic form where button was pressed
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    //console.log("currentPanel: " + currentPanelNumber); // test
    
    activateTextIDTask(event); // Activate task and put on event handlers
    
    // Add a remove last text section form button - just once!
    var removeLastTextFormButtonID = "removeLastTextFormButton" + currentPanelNumber;
    //boolean expression gives true if element already there, false otherwise
    var removeLastTextFormButtonCreated = !!document.getElementById(removeLastTextFormButtonID);
    // Create button when indicateTextButton is clicked - only do this once per button
    if (!removeLastTextFormButtonCreated) {
        var removeLastTextFormButton = document.createElement("BUTTON");
        removeLastTextFormButton.innerHTML = "Remove Last Text Section";
        removeLastTextFormButton.setAttribute("id", removeLastTextFormButtonID);
        removeLastTextFormButton.setAttribute("onclick", "removeLastTextForm(event)");
        // put the button after the indicateTextButton on that panel
        var indicateTextButton = document.getElementById("indicateTextButton" + (currentPanelNumber + 1));
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(removeLastTextFormButton, indicateTextButton.nextSibling);
    }
    
    // Add end text ID task button - just once!
    var endTextIDTaskButtonID = "endTextIDTaskButton" + currentPanelNumber;
    // boolean expression gives true if element already there, false otherwise
    var endTextIDTaskButtonCreated = !!document.getElementById(endTextIDTaskButtonID);
    // Create button when indicateTextButton is clicked - only do this once per button
    if (!endTextIDTaskButtonCreated) {
        var endTextIDTaskButton = document.createElement("BUTTON");
        endTextIDTaskButton.innerHTML = "End Task";
        endTextIDTaskButton.setAttribute("id", endTextIDTaskButtonID);
        endTextIDTaskButton.setAttribute("onclick", "endTextIDTask(event)");
        // put the button after the removeLastTextFormButton on that panel
        var removeLastTextFormButton = document.getElementById(removeLastTextFormButtonID);
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(endTextIDTaskButton, removeLastTextFormButton.nextSibling);
    }
    //console.log(endTextIDTaskButton.id); //text
}



/* Activate Text ID Task */
function activateTextIDTask(event) {
    
    // Add new event listeners to the mouse events
    canvas = document.getElementById("canvas"); // get the canvas
    context = canvas.getContext("2d");
    
    // get the correct x and y coords for the Text ID task
    reOffset_textID();
    
    window.onscroll = function(e) {
        reOffset_textID();
    }
    window.onresize = function(e) {
        reOffset_textID();
    }
    
    // event listener for moving the mouse
    // this should show the rectangle being formed on canvas
    
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get
    var numTextSectionsInPanel = pagesData[pageNum].panels[currentPanelNumber].textSections.length;
    if (numTextSectionsInPanel==0){
    
        canvas.addEventListener("mousemove", function(e) {
                                drawRectangleOnCanvas_textID.handleMouseMove(e);
                                }, false);
        
        //event listener for when the canvas is first clicked
        // this should get the top part of the rectangle
        canvas.addEventListener("mousedown", function(e) {
                                drawRectangleOnCanvas_textID.handleMouseDown(e);
                                }, false);
        
        // event listener for when the mouse is released from the canvas
        // this should generate the new char semantic form
        canvas.addEventListener("mouseup", function(e) {
                                drawRectangleOnCanvas_textID.handleMouseUp(e);
                                }, false);
        
        // event listener for mouseOut
        canvas.addEventListener("mouseout", function(e) {
                                drawRectangleOnCanvas_textID.handleMouseOut(e);
                                }, false);
        
        console.log("activateTextIDTask(event): Text ID event handers added"); // test
    }
}




// TEXT RECTS
// Draw the stored rectangles onto the canvas element
var drawRectangleOnCanvas_textID = {
    
handleMouseDown: function(e) {
    if (!textIdON) {
        return;
    }
    //console.log("mouse down for Char ID"); //test
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // var mousePos = getMousePos(canvas, e);
    // console.log(mousePos.x + ", " + mousePos.y); //test
    startX_textID = parseInt(e.clientX - recOffsetX_textID);
    startY_textID = parseInt(e.clientY - recOffsetY_textID);
    
    isRecDown = true;
},
    
handleMouseUp: function(e) {
    if (!textIdON) {
        return;
    }
    //console.log("mouse up"); //test
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    
    // Get which current panel number the char is in
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    
    //var mousePos = getMousePos(canvas, e);
    //console.log(mousePos.x + ", " + mousePos.y); //test
    mouseX_textID = parseInt(e.clientX - recOffsetX_textID);
    mouseY_textID = parseInt(e.clientY - recOffsetY_textID);
    
    isRecDown = false;
    
    pagesData[pageNum].panels[currentPanelNumber].textSections.push(newText); // Store created text section rects in the overall data structure
    
    //console.log("drawRectangleOnCanvas_charID.handleMouseUp(event) called");
    //console.log(e.target);
    //console.log(e.target.parentNode);
    //console.log(e.target.parentNode.parentNode);
    for (var p=0; p<pagesData[pageNum].panels.length; p++) {
        //console.log("Panel: " + p);
        //for (var i=0; i<pagesData[pageNum].panels[p].textSections.length; i++) {
        //    console.log(pagesData[pageNum].panels[p].textSections[i]); //test
       // }
    }
    
    drawRectangleOnCanvas_textID.drawAll_textID(); // Draw all char rects for that panel when mouse dragging stops
    drawCharacterInfoOnCanvas(); // Draw all char rects that have been drawn for all chars in all panels
    drawPanelInfoOnCanvas(); //Draw all the char rects in all panels on canvas
    drawTextSectionInfoOnCanvas(); // Draw all the text section rects in all panels on canvas
    
    // generate the semantic form associated with that text ID rect
    createTextForm();
},
    
drawAll_textID: function() {
    if (!textIdON) {
        return;
    }
    
    // put all the char ID rectangles on the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("Draw function pageNum: " + pageNum); //test
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw image on canvas
    context.lineWidth = 3;
    
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    
    //console.log(pagesData[pageNum].panels[currentPanelNumber].characters); //test
    
    for (var i=0; i<pagesData[pageNum].panels[currentPanelNumber].textSections.length; i++) {
        var q = pagesData[pageNum].panels[currentPanelNumber].textSections[i]; // Get all stored text section rects
        context.strokeStyle = q.color_textID;
        context.globalAlpha = 1; // set transparency value
        context.strokeRect(q.left, q.top, q.right - q.left, q.bottom - q.top);
        
        context.beginPath(); // draw circle
        context.arc(q.left, q.top, 12, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = q.color_textID;
        context.fill();
        
        // put the textNum index in the circle
        context.beginPath(); // draw number in circle
        context.fillStyle = "white";
        context.font = "15px Arial Black";
        context.fillText(q.id, q.left-6, q.top+6); // center into the circle
    }
},
    
handleMouseOut: function(e) {
    if (!textIdON) {
        return;
    }
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    //var mousePos = getMousePos(canvas, e);
    mouseX_textID = parseInt(e.clientX - recOffsetX_textID);
    mouseY_textID = parseInt(e.clientY - recOffsetY_textID);
    
    isRecDown = false;
},
    
handleMouseMove: function(e) {
    if (!textIdON) {
        return;
    }
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    if (!isRecDown) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    //var mousePos = getMousePos(canvas, e);
    mouseX_textID = parseInt(e.clientX - recOffsetX_textID);
    mouseY_textID = parseInt(e.clientY - recOffsetY_textID);
    
    // Get which current panel number the char is in
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    //console.log("current panel num: " + currentPanelNumber); //test
    
    // Create new char element and new storage for associated data
    newText = {
    left: Math.min(startX_textID, mouseX_textID),
    right: Math.max(startX_textID, mouseX_textID),
    top: Math.min(startY_textID, mouseY_textID),
    bottom: Math.max(startY_textID, mouseY_textID),
    color_textID: "#1BE300",
    id : pagesData[pageNum].panels[currentPanelNumber].textSections.length + 1,
    type: ""
    }
    //console.log("currentPanel: " + currentPanelNumber); // test
    drawRectangleOnCanvas_textID.drawAll_textID();
    context.strokeStyle = "#1BE300";
    context.lineWidth = 3;
    context.globalAlpha = 1;
    context.strokeRect(startX_textID, startY_textID, mouseX_textID - startX_textID, mouseY_textID - startY_textID);

    }
}



/* Generate a new text form for each text section/bubble identitifed  */
function createTextForm() {
    
    //var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    
    currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    
    // assign the index of the text form - the text index is enummerated for that particular panel
    // store the number of indicated chars
    newTextIndex = pagesData[pageNum].panels[currentPanelNumber].textSections.length;
    
    // create a new form object with the text number/ID
    var textForm = document.createElement("form");
    textForm.setAttribute('method',"post");
    textForm.setAttribute('action',"true");
    textForm.id = "textForm" + newTextIndex;
    textForm.setAttribute("class", "textForms");
    
    // first, put the number of the text section
    var textSectionNumberLabel = document.createElement("P");
    textSectionNumberLabel.innerHTML = newTextIndex + ": ";
    textSectionNumberLabel.style.display = "inline";
    textSectionNumberLabel.style.fontWeight = "bold";
    textSectionNumberLabel.style.fontFamily = "arial";
    textSectionNumberLabel.setAttribute('id', "textSectionNumberLabel" + currentPanelNumber + "." + newTextIndex);
    
    // create radio buttons to decide what type of text section it is:
    var narrationTextSectionButton = document.createElement("input"); // narration text button
    narrationTextSectionButton.setAttribute("type", "radio");
    narrationTextSectionButton.setAttribute("name", "textSectionType");
    narrationTextSectionButton.setAttribute("value", "narrationTextSection");
    narrationTextSectionButton.setAttribute('id', "narrationTextSection" + currentPanelNumber + "." + newTextIndex);
    narrationTextSectionButton.setAttribute("onchange", "narrationTextSectionButtonEvent()"); // when this button is selected, make sure that any inputs created for speech or other are removed
    narrationTextSectionButton.setAttribute("onclick", "changeTextLabelToWhite()");  // change label to white just in case it has been highlighted through validation
    //console.log(narrationTextSectionButton.id); //test
    
    var narrationTextSectionButtonLabel = document.createElement("label"); // narration text button label
    narrationTextSectionButtonLabel.setAttribute("for", "narrationTextSection" + newTextIndex);
    narrationTextSectionButtonLabel.innerHTML = "Narration ";
    narrationTextSectionButtonLabel.setAttribute('id', "narrationTextSectionButtonLabel" + currentPanelNumber + "." + newTextIndex);
    
    var speechTextSectionButton = document.createElement("input"); // speech text button
    speechTextSectionButton.setAttribute("type", "radio");
    speechTextSectionButton.setAttribute("name", "textSectionType");
    speechTextSectionButton.setAttribute("value", "speechTextSection");
    speechTextSectionButton.setAttribute('id', "speechTextSection" + currentPanelNumber + "." + newTextIndex);
    speechTextSectionButton.setAttribute("onchange", "showTextSectionCharInput()");  // when this button is selected, display the associated text input section
    speechTextSectionButton.setAttribute("onclick", "changeTextLabelToWhite()"); // change label to white just in case it has been highlighted through validation
    
    var speechTextSectionButtonLabel = document.createElement("label"); // speech text button label
    speechTextSectionButtonLabel.setAttribute("for", "speechTextSection" + currentPanelNumber + "." + newTextIndex);
    speechTextSectionButtonLabel.innerHTML = "Speech/Thought ";
    speechTextSectionButtonLabel.setAttribute('id', "speechTextSectionButtonLabel" + newTextIndex);
    
    var otherTextSectionButton = document.createElement("input"); // other text button
    otherTextSectionButton.setAttribute("type", "radio");
    otherTextSectionButton.setAttribute("name", "textSectionType");
    otherTextSectionButton.setAttribute("value", "otherTextSection");
    otherTextSectionButton.setAttribute('id', "otherTextSection" + currentPanelNumber + "." + newTextIndex);
    otherTextSectionButton.setAttribute("onchange", "showOtherCharInput()"); // When this button is selected, display the associated text input section
    otherTextSectionButton.setAttribute("onclick", "changeTextLabelToWhite()"); // change label to white just in case it has been highlighted through validation
    
    var otherTextSectionButtonLabel = document.createElement("label"); // other text button label
    otherTextSectionButtonLabel.setAttribute("for", "otherTextSection" + currentPanelNumber + "." + newTextIndex);
    otherTextSectionButtonLabel.innerHTML = "Other ";
    otherTextSectionButtonLabel.setAttribute('id', "otherTextSectionButtonLabel" + currentPanelNumber + "." + newTextIndex);
    
    var speechTextCharInputLabel = document.createElement("label"); // speech text character label
    speechTextCharInputLabel.setAttribute("for", "speechTextLabel" + currentPanelNumber + "." + newTextIndex);
    speechTextCharInputLabel.innerHTML = "Character speaking or thinking: ";
    
    
    // Append the inputs to the text form element
    textForm.appendChild(textSectionNumberLabel);
    textForm.appendChild(narrationTextSectionButton);
    textForm.appendChild(narrationTextSectionButtonLabel);
    textForm.appendChild(speechTextSectionButton);
    textForm.appendChild(speechTextSectionButtonLabel);
    textForm.appendChild(otherTextSectionButton);
    textForm.appendChild(otherTextSectionButtonLabel);
    

    // Put the text form between the "remove last text form" and "end task" button
    var endTextIDTaskButton = document.getElementById("endTextIDTaskButton" + currentPanelNumber);
    //var backgroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber + 1));
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(textForm, endTextIDTaskButton);
}




/* When a text section is selected as a speech or thought bubble, show the associating char input form */
function showTextSectionCharInput() {
    
    var textButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log("text button ID: " + textButtonID); //test
    
    var textForm = event.target.parentNode; // get id of the text form where the button was clicked
    //console.log("text form ID: " + textForm); //test
    
    var currentTextFormNum = (parseInt(textButtonID.split(".")[1])); // get the text form num from the end of the textButtonID
    //console.log(currentTextFormNum); //test
    
    // get the panel/section number of the associated form
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    // check if there is a speech form that already exists with the same ID
    var speechTextInputTestID = document.getElementById("textSpeechFormInput" + currentPanelNumber + "." + currentTextFormNum);
    //console.log(speechTextInputTestID); //test
    
    // if it has not been created, create it and add it to the text form
    if (speechTextInputTestID === null) {

        // create the speech form text input and label
        var textSpeechFormInput = document.createElement("input");
        textSpeechFormInput.setAttribute('type', "text");
        textSpeechFormInput.setAttribute('name', "speechVariable");
        textSpeechFormInput.setAttribute("class", "textSpeechInput");
        //textSpeechFormInput.style.display = "inline-block";
        textSpeechFormInput.value = textSpeechInstruction;
        textSpeechFormInput.setAttribute('id', "textSpeechFormInput" + currentPanelNumber + "." + currentTextFormNum);
        textSpeechFormInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
        //textSpeechFormInput.style.display = "inline-block";
        //console.log(textSpeechFormInput.id); //test

        var textSpeechFormInputLabel = document.createElement("label");
        textSpeechFormInputLabel.setAttribute("for", "speechVariable");
        textSpeechFormInputLabel.style.display = "block";
        textSpeechFormInputLabel.innerHTML = "Character: ";
        textSpeechFormInputLabel.setAttribute('id', "textSpeechFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
        
        
        // create a span to hold the textSpeech label and form
        var textSpeechFormSpan = document.createElement('span');
        textSpeechFormSpan.style = "white-space:nowrap";
        
        textSpeechFormInputLabel.appendChild(textSpeechFormInput);
        textSpeechFormSpan.appendChild(textSpeechFormInputLabel); // attach the label
        //textSpeechFormSpan.appendChild(textSpeechFormInput); // attach the form
        
        textForm.appendChild(textSpeechFormSpan); 

        //textForm.appendChild(textSpeechFormInputLabel); // attach to the document
        //textForm.appendChild(textSpeechFormInput);
        
        // if one of the other buttons is selected, then take the speech text form off of the other button
        var otherTextInputTestID = document.getElementById("otherFormInput" + currentPanelNumber + "." + currentTextFormNum);
        //console.log(otherTextInputTestID); //test
        
        if (otherTextInputTestID != null) {
            otherTextInputTestID.remove();
            var otherTextInputTestIDLabel = document.getElementById("otherFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
            otherTextInputTestIDLabel.remove();
        }
    } // if it already has been created, do not do anything!
}



/* When a text section is selected to be "other", show an input form that prompts a desription of the type of text */
function showOtherCharInput() {
    
    var textButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log("text button ID: " + textButtonID); //test
    
    var textForm = event.target.parentNode; // get id of the text form where the button was clicked
    //console.log("text form ID: " + textForm); //test
    
    var currentTextFormNum = (parseInt(textButtonID.split(".")[1])); // get the text form num from the end of the textButtonID
    //console.log(currentTextFormNum); //test
    
    // get the panel/section number of the associated form
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    // check if there is an "other" form that already exists with the same ID
    var otherTextInputTestID = document.getElementById("otherFormInput" + currentPanelNumber + "." + currentTextFormNum);
    //console.log(otherTextInputTestID); //test
    
    // if it has not been created, create it and add it to the text form
    if (otherTextInputTestID === null) {
        
        // create the speech form text input and label
        var otherFormInput = document.createElement("input");
        otherFormInput.setAttribute('type', "text");
        otherFormInput.setAttribute('name', "otherVariable");
        otherFormInput.setAttribute("class", "otherSpeechInput"); 
        otherFormInput.value = otherTextInstruction;
        otherFormInput.setAttribute('id', "otherFormInput" + currentPanelNumber + "." + currentTextFormNum);
        otherFormInput.setAttribute('onInput', "changeInputToWhite()"); // add event listener
        //console.log(textSpeechFormInput.id); //test
        
        var otherFormInputLabel = document.createElement("label");
        otherFormInputLabel.setAttribute("for", "otherVariable");
        otherFormInputLabel.style.display = "block";
        otherFormInputLabel.innerHTML = "Type: ";
        otherFormInputLabel.setAttribute('id', "otherFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
        
        // create a span to hold the otherForm label and text input together
        var otherFormSpan = document.createElement('span');
        otherFormSpan.style = "white-space:nowrap";
        
        otherFormInputLabel.appendChild(otherFormInput);
        otherFormSpan.appendChild(otherFormInputLabel);
        
        textForm.appendChild(otherFormSpan); 
        
        //textForm.appendChild(otherFormInputLabel); // attach to the document
        //textForm.appendChild(otherFormInput);
        
        // if the speech button is selected, then take the text form off of the speech button
        var speechTextInputTestID = document.getElementById("textSpeechFormInput" + currentPanelNumber + "." + currentTextFormNum);
        //console.log(speechTextInputTestID); //test
        
        if (speechTextInputTestID != null) {
            speechTextInputTestID.remove();
            var speechTextInputTestIDLabel = document.getElementById("textSpeechFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
            speechTextInputTestIDLabel.remove();
        }
    } // if it already has been created, do not do anything!
}



/* If the narrationTextSection radio button is selected, clear the forms from the Speech and Other Buttons */
// If there are any speech or other text forms created, get rid of them!
function narrationTextSectionButtonEvent() {
    
    var textButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log("text button ID: " + textButtonID); //test
    
    var textForm = event.target.parentNode; // get id of the text form where the button was clicked
    //console.log("text form ID: " + textForm); //test
    
    var currentTextFormNum = (parseInt(textButtonID.split(".")[1])); // get the text form num from the end of the textButtonID
    //console.log(currentTextFormNum); //test
    
    // get the panel/section number of the associated form
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    //var test = document.getElementById("narrationTextSection" + currentPanelNumber + "." + currentTextFormNum);
    //console.log(test); //test
    //console.log(test.checked); //test
    
    // if the speech button is selected, then take the text form off of the speech button
    var speechTextInputTestID = document.getElementById("textSpeechFormInput" + currentPanelNumber + "." + currentTextFormNum);
    //console.log(speechTextInputTestID); //test
    
    if (speechTextInputTestID != null) {
        speechTextInputTestID.remove();
        var speechTextInputTestIDLabel = document.getElementById("textSpeechFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
        speechTextInputTestIDLabel.remove();
    }
    
    // if one of the other buttons is selected, then take the speech text form off of the other button
    var otherTextInputTestID = document.getElementById("otherFormInput" + currentPanelNumber + "." + currentTextFormNum);
    //console.log(otherTextInputTestID); //test
    
    if (otherTextInputTestID != null) {
        otherTextInputTestID.remove();
        var otherTextInputTestIDLabel = document.getElementById("otherFormInputLabel" + currentPanelNumber + "." + currentTextFormNum);
        otherTextInputTestIDLabel.remove();
    }
}






/* Remove the last created text section form and associated rectangle */
function removeLastTextForm(event) {
    
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("removeLastTextFrom Button clicked"); //test
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    //var removeLastTextButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log("button ID: " + removeLastTextButtonID); //test
    
    var lastTextIndex = pagesData[pageNum].panels[currentPanelNumber].textSections.length-1;
    
    // remove the last text section form, which is the sibling previous to the newBackground heading
    var newBackGroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber+1));
    
    currentPanel.removeChild(newBackGroundHeading.previousSibling.previousSibling);
    
    // Remove last entry in panels[currentPanelNumber].characters
    pagesData[pageNum].panels[currentPanelNumber].textSections.pop();
    //console.log(pagesData[pageNum].panels[currentPanelNumber].textSections); //test
    

    // check if textID task was active
    var temp_textIdON = textIdON;
    console.log("temp_textIdON: " + temp_textIdON);
    
    // Redraw the current canvas to get rid of old character rectangle
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    
    
    // if the textId task was active, put the event handlers back on the page:
    if (temp_textIdON){
        
        textIdON = true;
        
        activateTextIDTask(event); // get the event back on
        
        //var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
        //var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get
        var numTextSectionsInPanel = pagesData[pageNum].panels[currentPanelNumber].textSections.length;
        if (numTextSectionsInPanel>0){
            
            canvas.addEventListener("mousemove", function(e) {
                                    drawRectangleOnCanvas_textID.handleMouseMove(e);
                                    }, false);
            
            //event listener for when the canvas is first clicked
            // this should get the top part of the rectangle
            canvas.addEventListener("mousedown", function(e) {
                                    drawRectangleOnCanvas_textID.handleMouseDown(e);
                                    }, false);
            
            // event listener for when the mouse is released from the canvas
            // this should generate the new char semantic form
            canvas.addEventListener("mouseup", function(e) {
                                    drawRectangleOnCanvas_textID.handleMouseUp(e);
                                    }, false);
            
            // event listener for mouseOut
            canvas.addEventListener("mouseout", function(e) {
                                    drawRectangleOnCanvas_textID.handleMouseOut(e);
                                    }, false);
            
            console.log("removeLastTextForm(event): Text ID event handers added"); // test
        }
        
        // add the event handler back for remove last text- TODO why do we have to do this?
        var removeLastTextFormButtonID = "removeLastTextFormButton" + currentPanelNumber;
        var removeLastTextFormButton = document.getElementById(removeLastTextFormButtonID);
        removeLastTextFormButton.setAttribute("onclick", "removeLastTextForm(event)");
        
    }
    
}






/* Stop the text section ID task and show the background section */
function endTextIDTask(event) {
    
    textIdON = false; // turn off the boolean for the text ID task
    
    // change the button color to indicate the activity is turned on
    document.getElementById("indicateTextButton" + (currentPanelNumber+1)).style.color = "black";
    // change the button's function so that the text ID task can be activated again
    document.getElementById("indicateTextButton" + (currentPanelNumber+1)).setAttribute("onclick", "startTextIDTask(event)");
    
    
    // clone and replace canvas to turn off the event handlers
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    
    // display the next element on the form that needs to be filled out:
    // change all the elements style for display from "none" to "inline-block"
    var newBackGroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber+1)).style.display = "block"; //display the heading for the section
    var backgroundForm = document.getElementById("backgroundForm" + (currentPanelNumber+1)).style.display = "inline-block"; // display the form elements for the section
    var backgroundLocationLabelLabel = document.getElementById("backgroundLocationLabelLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    var backgroundLocationLabelInput = document.getElementById("backgroundLocationLabelInput" + (currentPanelNumber+1)).style.display = "inline-block";
    var backgroundLocationInputLabel = document.getElementById("backgroundLocationInputLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    var backgroundLocationInput = document.getElementById("backgroundLocationInput" + (currentPanelNumber+1)).style.display = "inline-block";
    var blankBackgroundButton = document.getElementById("blankBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    var blankBackgroundButtonLabel = document.getElementById("blankBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    var detailedBackgroundButton = document.getElementById("detailedBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    var detailedBackgroundButtonLabel = document.getElementById("detailedBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    var textBackgroundButtonLabel = document.getElementById("textBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    var textBackgroundButton = document.getElementById("textBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    
    // show the indicateChar button in the next section
    var indicateCharButton = document.getElementById("indicateCharButton" + (currentPanelNumber+2));
    if (indicateCharButton != null) {
        indicateCharButton.style.display = "block"; // check that there is an indicate char button, and if so show it
    }
    
}



/* changes the input background color to white when interacted with - this is put on all inputs just in case they have been highlighted through validation */
function changeInputToWhite() {
    var inputID = event.target.getAttribute("id"); // get the input id
    // change the input to white just in case the background has been highlighted after validation
    document.getElementById(inputID).style.backgroundColor = "white";
}


/* changes the label background color to white when a radio button is interacted with - this is put on all radio buttons just in case thier labels have been highlighted through verification */
function changeTextLabelToWhite() {
    // get the event target id
    var textButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    
    var textForm = event.target.parentNode; // get id of the text form where the button was clicked
    
    var currentTextFormNum = (parseInt(textButtonID.split(".")[1])); // get the text form num from the end of the textButtonID
    //console.log(currentTextFormNum); //test
    
    // get the panel/section number of the associated form
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    
    // get the associated label with this event target
    // change the label background to white just in case the background has been highlighted after validation
    document.getElementById("textSectionNumberLabel" + currentPanelNumber + "." + currentTextFormNum).style.backgroundColor = ""; // highlight input
}


/* changes the label background color to white when a radio button is interacted with - this is put on all radio buttons just in case thier labels have been highlighted through verification */
function changeBackgroundLabelToWhite() {
    // get the target id
    //var buttonID = event.target.getAttribute("id"); // get the id of the associated form

    // get the panel/section number of the associated form
    var currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanelNumber: " + currentPanelNumber); // test
    
    document.getElementById("blankBackgroundButtonLabel" + (currentPanelNumber+1)).style.backgroundColor = ""; // remove highlight
    document.getElementById("detailedBackgroundButtonLabel" + (currentPanelNumber+1)).style.backgroundColor = ""; // remove highlight
    document.getElementById("textBackgroundButtonLabel" + (currentPanelNumber+1)).style.backgroundColor = ""; // remove highlight
    
}







/* Draw the stored panel rectangles onto the page */
function drawPanelInfoOnCanvas() {
    //console.log("drawPanelInfoOnCanvas"); //test
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // show the panels stored in the data structure
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var r = pagesData[pageNum].panels[i];
        context.strokeStyle = r.color;
        context.globalAlpha = 1; // set transparency value
        context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
        
        context.beginPath(); // draw circle
        context.arc(r.left-5, r.top-5, 15, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = r.color;
        context.fill();
        
        context.beginPath(); // draw number in circle
        context.fillStyle = "white";
        context.font = "15px Arial Black";
        context.fillText(i+1, r.left-10, r.top); // center into the circle
    }
}

/* Draw the stored character rectangle info onto the page */
function drawCharacterInfoOnCanvas() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    //console.log("drawCharacterInfoOnCanvas"); //test
    // show the character rects stored in the data structure
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var r = pagesData[pageNum].panels[i];
        for (var j=0; j<r.characters.length; j++) {
            var char = r.characters[j];
            context.strokeStyle = char.color_charID;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(char.left, char.top, char.right - char.left, char.bottom - char.top);
            
            context.beginPath(); // put the circles on as well
            context.arc(char.left, char.top, 15, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = char.color_charID;
            context.fill();
            
            if (char.label != charLabelInstruction) {
                context.beginPath(); // draw char label variable in circle
                context.fillStyle = "white";
                context.font = "15px Arial Black";
                context.fillText(char.label, char.left-6, char.top+8); // center into the circle
            }
        }
    }
}


/* Draw the stored text section rectangles and info onto the page */
function drawTextSectionInfoOnCanvas() {
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var p = pagesData[pageNum].panels[i];
        for (var j=0; j<p.textSections.length; j++) {
            var text = p.textSections[j];
            context.strokeStyle = text.color_textID;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(text.left, text.top, text.right - text.left, text.bottom - text.top);
            
            context.beginPath(); // put the circles on as well
            context.arc(text.left, text.top, 12, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = text.color_textID;
            context.fill();
            
            context.beginPath(); // draw char label variable in circle
            context.fillStyle = "white";
            context.font = "15px Arial Black";
            context.fillText(text.id, text.left-6, text.top+6); // center into the circle
            
        }
    }
}


/* End Page 'Next Story' Resetting Button and End Annotations */

/* Starts the annotation task with the Next Story */
function nextStory(event) {
    //console.log("It worked!"); //test
    location.href = 'index.html'; // go back to the main annotation page
}




/* Read in JSON DATA to Check Annotated Pages */









