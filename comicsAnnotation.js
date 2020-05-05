


/* GLOBAL VARIABLES */

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

var newPanel;  // new panel that's just been drawn for a panel position

var panelNum = 1; // ID of current panel being drawn

// Boolean whether user can draw rects on the canvas
var drawRectsON = false;

// Boolean to state whether the panel id task buttons are hidden or visible
var panelButtonsVisible = false;

// Create between page (previous and next page) navigation buttons
var navigationButtonsCreated = false;

// Boolean whether mouseclick for char task is on
var charIdON = false;

// Track the num panel being interacted with
var currentPanel;

// Track the current char form being created
var currentForm;

// Preset value for char and description inputs
const charLabelInstruction = "variable (e.g. x1, x2)";
const charDescriptionInstruction = "descriptor (e.g. girl)";
const backgroundLocationInstruction = "descriptor (e.g. forest)";



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
        comicPages[i].height = 630;
        comicPages[i].width = 450;
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
        "comicPages/Page1.jpeg",
        "comicPages/Page2.jpeg",
        "comicPages/Page3.jpeg"
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
    context = canvas.getContext("2d"); // Get context of canvas
    
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw the comic page
}


/* Add first comic page image to the canvas, add a new entry to the list that stores all data */
function putFirstComicPageOnCanvas() {
    pageNum = 0;
    putComicPageOnCanvas();
    
    // Reveal the section showing the panel ID task buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
    var startAnnotationButton = document.getElementById("startAnnotation");
    startAnnotationButton.innerHTML = "Page 1";
    startAnnotationButton.style.cursor = "default";
    // Turn off the button's onlick capabilties
    startAnnotationButton.setAttribute("onclick", "true");
    //console.log("After Start Annotation Button, pageNum is " + pageNum); //test
    // Push new dict to pagesData and add empty panels list
    pagesData.push({});
    pagesData[pageNum].panels = [];
}


/* When Next Page button is pressed */
function nextPage(event) {
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

    
    // Go to next page
    pageNum += 1;
    charIdON = false;  // turn off both (panel ID and char ID) event handlers
    drawRectsON = false;
    // Check whether this is the last page. If so, reset bottom buttons
    if (pageNum == comicPages.length-1) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Submit";
        buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
    } else {
        // if not last one then just next page button
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Next Page";
        buttonChange.setAttribute("onclick", "nextPage(event)");
    }
    removeSemanticForms(); // Clear the panel submission forms
    putComicPageOnCanvas(); // Put next page on canvas
    
    // Put the old mousedown listener event back - the panel ID event listener
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    canvas.addEventListener("mousedown",
                            drawRectangleOnCanvas.handleMouseDown,
                            false);
    
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotation").innerHTML = "Page " + pageNumTitle;
    // Show the panel demarcation section with the buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
    
    // If this is a revisit to a page, populate with right info - elements from the stored semantic container
    if ((pageNum+1) <= pagesData.length) {
        drawPanelInfoOnCanvas();
        drawCharacterInfoOnCanvas();
        
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
        // make sure if new only new panel drawing
        canvas.removeEventListener("mousedown", charIDTask);
        canvas.addEventListener("mousedown",
                        drawRectangleOnCanvas.handleMouseDown,
                                false);
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
    // Store current semantic forms - html elements
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    
    // Show panel ID task buttons if not visible
    if (panelButtonsVisible == false) {
        panelButtonsVisible = true;
        document.getElementById("panelIdSection").style.display = "block";
    }
    
    pageNum -= 1; // Decrement pageNum index
    charIdON = false;  // turn off both (panel and char ID) event handlers
    drawRectsON = false;
    //console.log("Previous Page pageNum = " + pageNum); // test
    removeSemanticForms(); // Clear the semantic submission forms
    putComicPageOnCanvas(); // Put previous image on canvas
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotation").innerHTML = "Page " + pageNumTitle;
    
   
    drawPanelInfoOnCanvas(); // Put stored panel rects on canvas
    drawCharacterInfoOnCanvas(); // Put stored char info on canvas
    
    // if there are panels, redraw the char instruction panel
    // and get rid of panel instruction form
    console.log(pagesData[pageNum]);
    console.log(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true));
    
    if (pagesData[pageNum].panels.length>0){
        
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
        panelCounter(pagesData[pageNum].panels.length);
    }
    
    
    var parent = document.getElementById("semanticFormContainer").parentNode;
    parent.replaceChild(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true),
                        document.getElementById("semanticFormContainer"));
    
    
}


function validateInputs() {
    //  Returns boolean and a warning string
    // Go through each input on the semantic forms to check that they are filled in
    var errorMessage = "";
    
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var panel = pagesData[pageNum].panels[i];
        console.log(panel);
        for (var j=0; j<panel.characters.length; j++) {
            var character = panel.characters[j];
            if (character.label == "" || character.label == charLabelInstruction ) {
                errorMessage += "Missing Character Label for Panel " + (i + 1) + " Character Number " + (j + 1) + "\n";
            }
            // Get
            var characterDescriptionInput = document.getElementById("charDescriptionInput" + i + "." + j).value;
            if (characterDescriptionInput == "" || characterDescriptionInput == charDescriptionInstruction) {
                errorMessage += "Missing Character Description for Panel " + (i + 1) + " Character Number " + (j + 1) + "\n";
            } else {
                pagesData[pageNum].panels[i].characters[j].Description = characterDescriptionInput;
            }
            var offPanelButtonChecked = document.getElementById("offPanel" + i + "." + j).checked;
            var onPanelButtonChecked = document.getElementById("onPanel" + i + "." + j).checked;
            if (!(offPanelButtonChecked || onPanelButtonChecked)) {
                errorMessage += "Missing Off/OnPanel Choice for Panel " + (i + 1) + " Character Number " + (j + 1) + "\n";
            } else {
                pagesData[pageNum].panels[i].characters[j].offPanel = offPanelButtonChecked;
            }

        }
        var backgroundLocationDescriptionInput = document.getElementById("backgroundLocationInput" + (i + 1)).value;
        if (backgroundLocationDescriptionInput == "" || backgroundLocationDescriptionInput == backgroundLocationInstruction) {
            errorMessage += "Missing Background Location for Panel " + (i + 1) + "\n";
        } else {
            pagesData[pageNum].panels[i].background.location = backgroundLocationDescriptionInput;
        }
        var backgroundEmptyButtonChecked = document.getElementById("blankBackgroundButton" + (i + 1)).checked;
        var backgroundDetailedButtonChecked = document.getElementById("detailedBackgroundButton" + (i + 1)).checked;
        if (!(backgroundEmptyButtonChecked || backgroundDetailedButtonChecked)) {
            errorMessage += "Missing Empty/Detailed Background Choice for Panel " + (i + 1) + "\n";
        } else {
            pagesData[pageNum].panels[i].background.detail = backgroundDetailedButtonChecked;
        }
        
    }
    if (pagesData[pageNum].panels.length==0){
        errorMessage = "Please draw at least one panel/section, even if it covers the whole page!";
    }
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
            context.font = "20px Arial Black";
            context.fillText(panelNum, j.left-8, j.top+8); // center into the circle
            panelNum += 1;
            //console.log(panelNum); // test
        }
        //panelNum = 1; // reset numbered rectangles
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
        context.lineWidth = 4;
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var r = pagesData[pageNum].panels[i]; // Get all stored panel rects
            context.strokeStyle = r.color;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    
            context.beginPath(); // draw circle
            context.arc(r.left, r.top, 25, 0, Math.PI * 2, true);
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
            characters: [],
            background: {location : "",
                detail : 0}
        }
        drawRectangleOnCanvas.drawAll();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 4;
        context.globalAlpha = 1;
        context.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
    }
}



/* Draw the panel ID rects when the start button is pressed */
function recordRectsON(event) {
    //event = button click
    drawRectsON = true;
    // console.log("After Start Button, pageNum is " + pageNum); //test
}


/* Turn OFF the recordClickOnComicImage function to stop drawing panel rects on canvas, and show the Semantic Forms - one per panel */
function recordRectsOFF(event) {
    //event = button click
    drawRectsON = false; // Disable drawing panel rects on canvas
    if (panelButtonsVisible == true) {
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
    }
    // State how many panel rectangles were drawn
    document.getElementById("panelNumSection").style.display = "block";
    panelRecNum = pagesData[pageNum].panels.length + 1;
    panelCounter(panelRecNum-1);
    showContentForms(panelRecNum-1);
    // Only create buttons at the bottom page when this function runs for the first page
    if (document.getElementById("startAnnotation").innerHTML == "Page 1" && !navigationButtonsCreated) {
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
}




/* SEMANTIC FORM CREATION, NAVIGATION and SUBMISSION */

/*  State how many panels or sections have been identified by the user */
function panelCounter(x) {
    // Parameter x is the number of panels or sections specified by the user
    document.getElementById("panelNumSection").style.display = "inline-block"; 
    if (x==1) {
        document.getElementById("panelCount").innerHTML = "There is " + x + " panel/section on this page.";
        return;
    }
    document.getElementById("panelCount").innerHTML = "There are " + x + " panels/sections on this page.";
}



/* Show the form sections that need to be filled in - the number of forms that apper should be the number of panels indicated by the user */
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
        newHeading.innerHTML = "Panel " + j;
        clone.insertBefore(newHeading, clone.childNodes[0]);
        // Character ID and description section
        var newCharHeading = document.createElement("h4"); // Characters heading
        newCharHeading.innerHTML = "Characters";
        clone.insertBefore(newCharHeading, newHeading.nextSibling);
        
        var indicateCharButton = document.createElement("BUTTON"); // start task button
        indicateCharButton.id = "indicateCharButton" + j;
        indicateCharButton.innerHTML = "Indicate Characters";
        indicateCharButton.setAttribute("onclick","startIndividualCharID(event)");
        clone.insertBefore(indicateCharButton, newCharHeading.nextSibling);
        
        var newBackgroundHeading = document.createElement("h4"); // Background heading
        newBackgroundHeading.id = "newBackgroundHeading" + j;
        newBackgroundHeading.innerHTML = "Background";
        clone.insertBefore(newBackgroundHeading, indicateCharButton.nextSibling);
        
        // Create background description form
        var backgroundForm = document.createElement("form"); // Form element
        backgroundForm.setAttribute('method',"post");
        backgroundForm.setAttribute('action',"true");
        backgroundForm.setAttribute('id',"backgroundForm" + j);
        
        var backgroundLocationInput = document.createElement("input"); //input element for location
        backgroundLocationInput.setAttribute('type',"text");
        backgroundLocationInput.setAttribute('name',"backgroundLocationInput");
        backgroundLocationInput.setAttribute('id',"backgroundLocationInput" + j);
        backgroundLocationInput.value = backgroundLocationInstruction;
        
        var backgroundLocationInputLabel = document.createElement("label"); // label for location
        backgroundLocationInputLabel.setAttribute("for", "backgroundLocationInput" + j);
        backgroundLocationInputLabel.innerHTML = "Location: ";
        backgroundLocationInputLabel.setAttribute('id', "backgroundLocationInputLabel" + j);
        
        var blankBackgroundButton = document.createElement("input"); // blank background radio button
        blankBackgroundButton.setAttribute("type", "radio");
        blankBackgroundButton.setAttribute("name", "backgroundDetail");
        blankBackgroundButton.setAttribute("value", "blankBackground");
        blankBackgroundButton.setAttribute('id', "blankBackgroundButton" + j);
        
        var blankBackgroundButtonLabel = document.createElement("label");
        blankBackgroundButtonLabel.setAttribute("for", "blankBackground");
        blankBackgroundButtonLabel.innerHTML = "Blank/Empty";
        blankBackgroundButtonLabel.setAttribute('id', "blankBackgroundButtonLabel" + j);
        
        var detailedBackgroundButton = document.createElement("input"); // fully drawn background radio button
        detailedBackgroundButton.setAttribute("type", "radio");
        detailedBackgroundButton.setAttribute("name", "backgroundDetail");
        detailedBackgroundButton.setAttribute("value", "detailedBackground");
        detailedBackgroundButton.setAttribute('id', "detailedBackgroundButton" + j);
        
        var detailedBackgroundButtonLabel = document.createElement("label");
        detailedBackgroundButtonLabel.setAttribute("for", "fullyDrawnBackground");
        detailedBackgroundButtonLabel.innerHTML = "Detailed";
        detailedBackgroundButtonLabel.setAttribute('id', "detailedBackgroundButtonLabel" + j);
        
        // Append the inputs to the form element
        backgroundForm.appendChild(backgroundLocationInputLabel);
        backgroundForm.appendChild(backgroundLocationInput);
        var breakElement = document.createElement("br");
        backgroundForm.appendChild(breakElement); // Add a break element between inputs
        backgroundForm.appendChild(blankBackgroundButton);
        backgroundForm.appendChild(blankBackgroundButtonLabel);
        backgroundForm.appendChild(detailedBackgroundButton);
        backgroundForm.appendChild(detailedBackgroundButtonLabel);
        
        // Append the form element to the panel form
        clone.insertBefore(backgroundForm, newBackgroundHeading.nextSibling);
        
        // Append the cloned semantic form to correct section
        document.getElementById("semanticFormContainer").appendChild(clone);
        //console.log(clone.id); //test
            
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
    buttonPreviousPage.setAttribute("class","panelIDButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonPreviousPage);
    
    // Reset all forms button
    var buttonReset = document.createElement("BUTTON");
    buttonReset.innerHTML = "Reset Page";
    buttonReset.setAttribute("id", "buttonReset");
    buttonReset.setAttribute("onclick", "resetPage(event)");
    buttonReset.setAttribute("class","panelIDButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonReset);
    
    // Next Page button
    var buttonNextPage = document.createElement("BUTTON");
    buttonNextPage.innerHTML = "Next Page";
    buttonNextPage.setAttribute("id", "buttonNextPage");
    buttonNextPage.setAttribute("class","panelIDButtons");
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
    removeSemanticForms();
    pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
    charIdON = false;  // turn off both (panel ID and char ID) event handlers
    drawRectsON = false;
    
    putComicPageOnCanvas(); // Put next page on canvas
    
    // Put the old mousedown listener event back - the panel ID event listener
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.removeEventListener("mousedown",
                               charIDTask,
                               false);
    canvas.addEventListener("mousedown",
                            drawRectangleOnCanvas.handleMouseDown,
                            false);
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    
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
    
    // Eventually, get the pagesData file email

    // For now, just post to console
    console.log(pagesData);
    console.log( JSON.stringify(pagesData) );
}




/* ANNOTATION and DATA SUBMISSION within SEMANTIC FORMS - Interaction and data inputs */

/* Function to start Char ID canvas clicking task */
function startIndividualCharID(event) {
    //event = click
    //set current panel according to the button pressed
    charIdON = true;
    currentPanel = event.target.parentNode; // Get semantic form where button was pressed
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    //console.log("currentPanel: " + currentPanelNumber); // test
    var instructionID = "charClickInstructions" + currentPanelNumber;
    //boolean expression gives true if element already there, false otherwise
    var charInstructionsCreated = !!document.getElementById(instructionID);
    // Give simple instruction when indicateCharButton clicked - only do this once per button
    //Only give instruction if not already created
    if (!charInstructionsCreated) {
        var charClickInstructions = document.createElement("p");
        charClickInstructions.innerHTML = "Click on all the characters in the panel.";
        charClickInstructions.setAttribute("id", instructionID);
        currentPanel.insertBefore(charClickInstructions, currentPanel.childNodes[3]);
    }
    //console.log("button pressed"); //tests
    // Create and append the buttons
    //var buttonID = event.target.getAttribute('id');
   // console.log("button name: ", buttonID); //test
   //console.log("panel form number: ", currentPanel.getAttribute('id')); //test
    activateCharIDTask(event); // Turn on ability to click on the canvas
}



/* Start Char ID Task - Function to enable clicking on the canvas */
function activateCharIDTask(event) {
    // Add new event listener to mousedown event
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("mousedown",
                            charIDTask,
                            false);
}


/* Char ID on canvas - Function to click on canvas, get char variables */
function charIDTask(event) {
    if (!charIdON) {
        return;
    }
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    console.log("current panel num: " + currentPanelNumber);
    
    // Track the click nums - store the number of indicated chars
    var newCharIndex = pagesData[pageNum].panels[currentPanelNumber].characters.length;
    
    // When mouse down, get the coords of the click
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // tell the browser we're handling this event
    event.preventDefault();
    event.stopPropagation();

    coordX = parseInt(event.clientX - recOffsetX);
    coordY = parseInt(event.clientY - recOffsetY);
    //console.log(coordX + ", " + coordY); //test, check the mousedown coords
    
    // Put down a circle with number of the char
    context.beginPath(); // draw circle
    context.arc(coordX, coordY, 25, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "blue";
    context.fill();
    //console.log("circle created"); //test
    
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
    charFormInput.value = charLabelInstruction;
    charFormInput.setAttribute('id', "charFormInput"  + currentPanelNumber +  "." + newCharIndex);
    
    var charFormInputLabel = document.createElement("label"); // Label for the character form input
    charFormInputLabel.setAttribute("for", "charFormInput" + currentPanelNumber +  "." + newCharIndex);
    charFormInputLabel.innerHTML = "Character Variable: ";
    
    //console.log("char input ID: " + charFormInput.id); //test
    
    // Text input box for character description
    var charDescriptionInput = document.createElement("input");
    charDescriptionInput.setAttribute('type',"text");
    charDescriptionInput.setAttribute('name',"characterDescription");
    charDescriptionInput.value = charDescriptionInstruction;
    charDescriptionInput.setAttribute('id', "charDescriptionInput" + currentPanelNumber + "." + newCharIndex);
    
    // Label for the char description form input
    var charDescriptionInputLabel = document.createElement("label");
    charDescriptionInputLabel.setAttribute("for", "charDescrptionInput" + currentPanelNumber + "." + newCharIndex);
    charDescriptionInputLabel.innerHTML = "Character Description: ";
    
    // Char variable confirmation button - now listed as "update variable name" button
    var charFormInputConfirmButton = document.createElement("input");
    charFormInputConfirmButton.setAttribute("type", "button");
    charFormInputConfirmButton.setAttribute("value", "Update Variable");
    charFormInputConfirmButton.setAttribute("id", "charFormInputConfirmButton" + currentPanelNumber +  "." + newCharIndex);
    charFormInputConfirmButton.setAttribute("onclick", "confirmCharButton(event)");
    
    // Create radio buttons for on/off panel chars
    var onPanelButton = document.createElement("input"); // on panel radio button
    onPanelButton.setAttribute("type", "radio");
    onPanelButton.setAttribute("id", "onPanel" + currentPanelNumber + "." + newCharIndex);
    onPanelButton.setAttribute("name", "onOffPanel");
    onPanelButton.setAttribute("value", "onPanel");
    
    var onPanelButtonLabel = document.createElement("label");
    onPanelButtonLabel.setAttribute("for", "onPanel");
    onPanelButtonLabel.innerHTML = "On Panel";
    
    var offPanelButton = document.createElement("input"); // off panel radio button
    offPanelButton.setAttribute("type", "radio");
    offPanelButton.setAttribute("id", "offPanel" + currentPanelNumber + "." + newCharIndex);
    offPanelButton.setAttribute("name", "onOffPanel");
    offPanelButton.setAttribute("value", "offPanel");
    
    var offPanelButtonLabel = document.createElement("label");
    offPanelButtonLabel.setAttribute("for", "offPanel");
    offPanelButtonLabel.innerHTML = "Off Panel";
    
    // Create button to remove character form
    var removeLastCharButton = document.createElement("input");
    removeLastCharButton.setAttribute("type","button");
    removeLastCharButton.setAttribute("value","Remove Character");
    removeLastCharButton.setAttribute("id", "removeCharButton" + currentPanelNumber +  "." + newCharIndex);
    removeLastCharButton.setAttribute("onclick","true");
    
    // Append all input elements to the form element
    charForm.appendChild(charFormInputLabel); // Add the char variable form label
    charForm.appendChild(charFormInput); // Add the char form input
    charForm.appendChild(charFormInputConfirmButton); // Add the confirm char button
    var breakElement1 = document.createElement("br");
    charForm.appendChild(breakElement1); // Put a break to separate input forms
    charForm.appendChild(charDescriptionInputLabel); // Add the char description form label
    charForm.appendChild(charDescriptionInput); // Add the char description input
    var breakElement2 = document.createElement("br");
    charForm.appendChild(breakElement2); // Put a break to separate input forms
    charForm.appendChild(onPanelButton); // Add on panel radio button
    charForm.appendChild(onPanelButtonLabel); // Add on panel radio button label
    charForm.appendChild(offPanelButton); // Add off panel radio button
    charForm.appendChild(offPanelButtonLabel); // Add off panel radio button label
    
    // Append the form element to the bottom of the paragraph instructions on the panel semantic form
    console.log(currentPanel.getAttribute("id")); //test
    console.log("form id: " + charForm.id); //test
    //console.log("char click num: " + newCharIndex) //test
    
    var backgroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber + 1));
    console.log(backgroundHeading);
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(charForm, backgroundHeading);
   
    // add a new char dict for this new char at end
    pagesData[pageNum].panels[currentPanelNumber].characters.push({label : "",
                           xcoord : coordX,
                           ycoord : coordY,
                           description : "",
                           offPanel : false
                           });
    
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
    
}


/* Confirm Char variable name button */
// Move the variable name inputted in form to the canvas
function confirmCharButton(event) {
    //event = button click
    var buttonID = event.target.getAttribute("id");
    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    console.log("currentPanel: " + currentPanelNumber); //test
    
    var currentCharacterID = event.target.getAttribute('id').replace("charFormInputConfirmButton", ""); // Get the ID of the button pressed
    console.log("current character: " + currentCharacterID); //test
    
    var charFormInput = document.getElementById("charFormInput"  + currentCharacterID);
    console.log("charFormInput ID: " + charFormInput.id);
    var inputValue = charFormInput.value;
    console.log("value: " + inputValue); //test
    if (inputValue.length == 0) {
        return;
    }

    // Store inputValue into tha right char structure's label field
    var currentCharacterNum = parseInt(currentCharacterID.split(".")[1]);
    //console.log(currentCharacterID.split("."));
    //console.log("current character number: " + currentCharacterNum);
    
    pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].label = inputValue;
    
    // Draw that label as white text on the associated circle on the canvas
    var xcoord = pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].xcoord;
    var ycoord = pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].ycoord;
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.beginPath(); // Redraw circle
    context.arc(xcoord, ycoord, 25, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "blue";
    context.fill();
    context.beginPath(); // draw number in circle
    context.fillStyle = "white";
    context.font = "20px Arial Black";
    context.fillText(inputValue, xcoord-8, ycoord+8);
    
}


/* Remove the last created char form */
function removeLastCharFormButton(event) {
    //event = mouse click
    
    // Remove the last created char input form
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    console.log("currentPanel: " + currentPanelNumber); //test
    var lastCharIndex = pagesData[pageNum].panels[currentPanelNumber].characters.length-1;
    
    // remove the last char form, which is the sibling previous to the newBackground heading
    var backgroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber + 1));
    console.log(backgroundHeading);
    
    currentPanel.removeChild(backgroundHeading.previousSibling);
    
    // Remove last entry in panels[currentPanelNumber].characters
    pagesData[pageNum].panels[currentPanelNumber].characters.pop();
    
    // Redraw the current canvas to get rid of old character dot
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    
}


/* Draw the stored panel rectangles onto the page */
function drawPanelInfoOnCanvas() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // show the panels stored in the data structure
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var r = pagesData[pageNum].panels[i];
        context.strokeStyle = r.color;
        context.globalAlpha = 1; // set transparency value
        context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
        
        context.beginPath(); // draw circle
        context.arc(r.left, r.top, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = r.color;
        context.fill();
        
        context.beginPath(); // draw number in circle
        context.fillStyle = "white";
        context.font = "20px Arial Black";
        context.fillText(i+1, r.left-8, r.top+8); // center into the circle
    }
}

/* Draw the stored character info onto the page */
function drawCharacterInfoOnCanvas() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // show the character blue dots stored in the data structure
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var r = pagesData[pageNum].panels[i];
        for (var j=0; j<r.characters.length; j++) {
            var char = r.characters[j];
            // Put down a circle with number of the char
            context.beginPath(); // draw circle
            context.arc(char.xcoord, char.ycoord, 25, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = "blue";
            context.fill();

            context.beginPath(); // draw number in circle
            context.fillStyle = "white";
            context.font = "20px Arial Black";
            context.fillText(char.label, char.xcoord-8, char.ycoord+8);
        }
    }
}





/* Firebase Database Collection and Retreival

// Test - Get and show the stored data from Firebase
const testList = document.querySelector("#Test");

// Create element and render test
function renderTest(doc) {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    
    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    
    li.appendChild(name);
    li.appendChild(city);
    
    testList.appendChild(li);
}

db.collection("Test").get().then((snapshot) => {
                                // console.log(snapshot.docs);
                                 snapshot.docs.forEach(doc => {
                                 console.log(doc.data());
                                 renderTest(doc);
                                                       });
                                 });
*/

// Reference to the collection 'Test', then a method to get all the documents in the collection. The 'then' method calls a function to fire when the data is collected









