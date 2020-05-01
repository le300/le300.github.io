


/* GLOBAL VARIABLES */

// Declare canvas configuration variables
var canvas, context;

// Initialize an array to hold preloaded comic page images
var comicPages = [];

// Array to store data for each comic page
var pagesData = [];

// Declare the index in the array to retrieve comic pages in order
var pageNum;

// Drawing Rectangles - Variables for drawing on canvas
var isRecDown = false;
var startX, startY;

var rects = []; // Individual page data for current page - store rect info per page
var newRect;
var rectNum = 1; // Number of drawn rectangle (In the circle on the rectangle)


var drawRectsON = false;

// Panel buttons hidden or visible
panelButtonsVisible = false;

// Create buttons
buttonsCreated = false;

// Char task
charIdON = false;

// Track the number of characters clicked on
var charClickNum = 0;

// Track the num panel being interacted with
var currentPanel;

// Track the current char form being created
var currentForm;






/* CANVAS and COMIC PAGES SETUP */
/* code references
 initializing the canvas: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
 mouse position on canvas:
 https://codepen.io/chrisjaime/pen/lcEpn?editors=1111
 */

/* INITIALIZATION of the WEBPAGE, IMAGES, and CANVAS*/

/* Function to setup the canvas - implemented after the HTML DOM loads*/
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
    // Add event listeners for rectangle drawing tool to the canvas
    adjustImageSizes();
    console.log("image sizes readjusted");
    addCanvasEvents();
}


/* Function that Gets Mouse Position - for debugging purposes */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}


/* Function to preload the comic page images and set their sizes */
function preload() {
    for (var i=0; i < preload.arguments.length; i++) {
        comicPages[i] = new Image();
        comicPages[i].src = preload.arguments[i];
        console.log("images preloaded");
    }
}


// Preload the comic page images after the canvas is set up
preload(
        "comicPages/Page1.jpeg",
        "comicPages/Page2.jpeg",
        "comicPages/Page3.jpeg"
        );


// Wait for HTML to load and then setup the canvas
document.addEventListener("DOMContentLoaded", init);



/* Function to adjust image sizes for all preloaded images during init*/
// At the moment, this is specific for the example image set to be 90% the size of the canvas
function adjustImageSizes() {
    for (var i=0; i < comicPages.length; i++) {
        comicPages[i].height = 630;
        comicPages[i].width = 450;
    }
}










/* COMIC PAGE PLACEMENT on CANVAS - AFTER  INITIALIZATION */


/* Function to add first comic page image to the canvas, setup the page */
// The argument pageNum is the index in the array that you want to
function putFirstComicPageOnCanvas() {
    pageNum = 0;
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the preloaded comic page image on the canvas
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height);
    // Reveal the next section on the semantic form
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
    var startAnnotationButton = document.getElementById("startAnnotation");
    startAnnotationButton.innerHTML = "Page 1";
    startAnnotationButton.style.cursor = "default";
    // Turn off the button's onlick capabilties
    startAnnotationButton.setAttribute("onclick", "true");
    //console.log("After Start Annotation Button, pageNum is " + pageNum); //test
}


/* Function to put a comic page on canvas (after first page) according to the sequence in comicPages and pageNum */
function putComicPageOnCanvas(event) {
    // Store the current page information, rects and form - for now, put in an array
    if (pagesData.length < pageNum+1) {
        pagesData.push({});
    }
    // Check how the data is being stored in the console
    pagesData[pageNum].rects = rects;
    for (var i=0; i < pagesData.length; i++) {
        for (var j=0; j < pagesData[i].rects.length; j++ ) {
            console.log(pagesData[i].rects[j]);
        }
    }
    //pagesData.push(["Page " + pageNum, rects]);
    //console.log(pagesData[pageNum]); // For now, check data is stored on console
    pageNum += 1;
    //console.log("After next page, pageNum is: " + pageNum);
    
    // Check whether this is the last page. If so, reset bottom buttons
    if (pageNum == comicPages.length-1) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Submit";
        buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
    }
    removeSemanticForms(); // Clear the submission forms
    rects = []; // Clear the comic image and data stored
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw the comic page
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotation").innerHTML = "Page " + pageNumTitle;
    // Show the panel demarcation section with the buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
}



/* Function to put the previous page on the canvas according to the current pageNum */
function putPreviousPageOnCanvas(event) {
    // First check if this is the first page in the comicPages sequence, and if so just return the function
    if (pageNum == 0) {
        return
    }
    if (panelButtonsVisible == false) {
        panelButtonsVisible = true;
        document.getElementById("panelIdSection").style.display = "block";
    }
    pageNum -= 1; // Decrement pageNum index
    //console.log("Previous Page pageNum = " + pageNum); // test
    removeSemanticForms(); // Clear the submission forms
    rects = []; // Clear the comic image and data stored
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw the comic page previous to the indicated comic page in pageNum
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotation").innerHTML = "Page " + pageNumTitle;
}


/*
// Test that the preload worked
function testPreload() {
    var imageTest = document.getElementById("holderImageElement");
    imageTest.src = comicPages[1].src;
} */









/* RECORDING USER SELECTIONS on a COMIC IMAGE */


/* Drawing Rectangles on Comic Image
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

// Add mouse events to canvas - use in the init function
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
        
        //var mousePos = getMousePos(canvas, e);
        //console.log(mousePos.x + ", " + mousePos.y); //test
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

        rects.push(newRect);

        drawRectangleOnCanvas.drawAll();
        
        // For every rect, put a number in the top left corner on the circle
        for (var i=0; i<rects.length; i++) {
            var j = rects[i];
            context.beginPath(); // draw number in circle
            context.fillStyle = "white";
            context.font = "20px Arial Black";
            context.fillText(rectNum, j.left-8, j.top+8); // center into the circle
            rectNum += 1;
            //console.log(rectNum); // test
        }
        rectNum = 1; // reset numbered rectangles
        
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
        for (var i=0; i<rects.length; i++) {
            var r = rects[i];
            context.strokeStyle = r.color;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    
            context.beginPath(); // draw circle
            context.arc(r.left, r.top, 25, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = r.color;
            context.fill();
            
            //var text = drawCount;
            //context.fillStyle = "#fff";
            //var font = "bold " + 2 + "px serif";
            //context.font = font;
            //var width = context.measureText(text).width;
            //var height = context.measureText("w").width; // this is a GUESS of height
            //context.fillText(text, r.left - (width / 2), r.top + (height / 2));
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
        newRect = {
            left: Math.min(startX, mouseX),
            right: Math.max(startX, mouseX),
            top: Math.min(startY, mouseY),
            bottom: Math.max(startY, mouseY),
            color: "#FF0000"
        }
        drawRectangleOnCanvas.drawAll();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 4;
        context.globalAlpha = 1;
        context.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
    }
}








/* Function to record the user drawn rectangles when the start button is pressed */
function recordRectsON(event) {
    //event = button click
    drawRectsON = true;
    // console.log("After Start Button, pageNum is " + pageNum); //test
}



/* Function to turn OFF the recordClickOnComicImage function and show Semantic Forms */
function recordRectsOFF(event) {
    //event = button click
    if (panelButtonsVisible == true) {
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
    }
    drawRectsON = false;
    // State how many rectangles were drawn
    document.getElementById("panelNumSection").style.display = "block";
    panelRecNum = rects.length + 1;
    panelCounter(panelRecNum-1);
    showContentForms(panelRecNum-1);
    // Only create buttons at the bottom page when this function runs for the first page
    if (document.getElementById("startAnnotation").innerHTML == "Page 1" && !buttonsCreated) {
        createButtons();
        createButtons = true;
    }
    panelRecNumStored = panelRecNum;
    panelRecNum = 1;
    // Store the rectangle info - for now just print to console
    for (var i=0; i<rects.length; i++) {
        panelRectNum = i + 1;
        // Tests:
        //console.log("Panel/Section: " + panelRectNum);
        //console.log("Rectangle Coords: " + rects[i].left + ", " + rects[i].top + ", " + rects[i].right + ", " + rects[i].bottom);
    }
    //pageNum += 1;
    //console.log("After End Button, pageNum is " + pageNum); //test
}


/* Function to clear all the drawn rectangles, restart the task */
function recordRectsCLEAR(event) {
    // event = button click
    // Clear the rectangles already drawn on the comic image
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Redraw image on canvas
    // Clear the collected panel/sections info
    rects = [];
}


/*  Function to clear the last drawn rectangle while keeping the others */
function clearLastDrawnRectangle(event) {
    // event = button click
    // clear out the last entry in rects array
    rects.pop();
    // Redraw the page with the stored rects
    drawRectangleOnCanvas.drawAll();
}










/* SEMANTIC FORM CREATION, NAVIGATION and SUBMISSION */

/* Function that states how many panels or sections have been identified by the user */

function panelCounter(x) {
    // Parameter x is the number of panels or sections specified by the user
    document.getElementById("panelNumSection").style.display = "inline-block"; 
    if (x==1) {
        document.getElementById("panelCount").innerHTML = "There is " + x + " panel on this page.";
        return;
    }
    document.getElementById("panelCount").innerHTML = "There are " + x + " panels on this page.";
}





/* Function to show the form sections that need to be filled in, the number of forms that apper should be the number of panels indicated by the user */

function showContentForms(x) {
    // Parameter x in the number of panels or sections specified by the user
    
    // Get the standard semantic form from the html doc
    var semanticForm = document.getElementById("semanticForm");
    
    // Create identical forms for each panel specified by the user
    for (let i=0; i<=x-1; i++) {
        // Var for panel number
        var j = i+1;
        // For each x in numPanels, create a clone of the semantic form
        var clone = semanticForm.cloneNode(true);
        // Set css class for display
        clone.setAttribute("class","semanticFormDisplay");
        // Change the id for the cloned form
        clone.id = "semanticForm" + j;
        // Create a heading to give the panel number for the new form
        var newHeading = document.createElement("h3");
        newHeading.innerHTML = "Panel " + j;
        clone.insertBefore(newHeading, clone.childNodes[0]);
        //Create the char ID that starts the task
        var newCharHeading = document.createElement("h4"); // Characters heading
        newCharHeading.innerHTML = "Characters";
        clone.insertBefore(newCharHeading, newHeading.nextSibling);
        
        var newChar = document.createElement("BUTTON"); // start task button
        newChar.id = "newChar" + j;
        newChar.innerHTML = "Indicate Characters";
        newChar.setAttribute("onclick","startIndividualCharID(event)");
        clone.insertBefore(newChar, newCharHeading.nextSibling);
        
        var newBackgroundHeading = document.createElement("h4"); // Background heading
        newBackgroundHeading.id = "newBackgroundHeading" + j;
        newBackgroundHeading.innerHTML = "Background";
        clone.insertBefore(newBackgroundHeading, newChar.nextSibling);
        
        // Append the cloned semantic form to correct section
        document.getElementById("semanticFormContainer").appendChild(clone);
        //console.log(clone.id); //test
            
    }
}





/* Function to create Previous Page, Reset, and Next Page buttons */
function createButtons() {
    // Create and append a button to submit all the contents of the semantic forms at once
    var buttonPreviousPage = document.createElement("BUTTON");
    buttonPreviousPage.innerHTML = "Previous Page";
    buttonPreviousPage.setAttribute("id", "buttonPreviousPage");
    buttonPreviousPage.setAttribute("onclick","putPreviousPageOnCanvas(event)");
    buttonPreviousPage.setAttribute("class","panelIDButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonPreviousPage);
    
    // Add event handler to the submission button
    //buttonSubmit.addEventListener("click:, function() { write function here });
    
    // Create and append a button to reset all the contents of the semantic forms
    var buttonReset = document.createElement("BUTTON");
    buttonReset.innerHTML = "Reset";
    buttonReset.setAttribute("id", "buttonReset");
    buttonReset.setAttribute("onclick", "resetSemanticForm(event)");
    buttonReset.setAttribute("class","panelIDButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonReset);
    
    // Add event handler to the reset button button
    //buttonReset.addEventListener("click:, function() { write function here });
    
    // Create and append a button to go to the next comic page
    var buttonNextPage = document.createElement("BUTTON");
    buttonNextPage.innerHTML = "Next Page";
    buttonNextPage.setAttribute("id", "buttonNextPage");
    buttonNextPage.setAttribute("class","panelIDButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonNextPage);
    buttonNextPage.setAttribute("onclick", "putComicPageOnCanvas(event)");
}





/* Function that removes the semantic forms */
function removeSemanticForms() {
    //console.log("The number of rects stored: " + rects.length); //test
    semanticFormContainer = document.getElementById("semanticFormContainer");
    while (semanticFormContainer.firstChild) {
        semanticFormContainer.removeChild(semanticFormContainer.lastChild);
    }
    // Reset and hide the panel counter
    document.getElementById("panelNumSection").style.display = "none";
}





/* Function to reset semantic forms */
function resetSemanticForm(event) {
    // event = click
    //for (let i=0; i<=panelClickNumStored; i++) {
      //  document.getElementById("semanticForm" + i).reset();
    //}
    
    // For now, just post to console
    console.log("Form Reset");
}




/* Function to submit semantic forms */
function submitSemanticForms(event) {
    //event = click
    // Eventually, the info in the forms will be stored in a database. For now, just send a message to the console.
    // for (let i=0; i<=panelClickNumStored; i++) {
    //    document.getElementById("semanticForm" + i).submit();
    // }
    
    // For now, just post to console
    console.log("Form submitted");
}









/* ANNOTATION within SEMANTIC FORMS - Interaction and data inputs */


/* Function to start Char ID task*/
function startIndividualCharID(event) {
    if (charIdON){
        return;   //stopping it regenerating if in the middle of clicking
    }
    charIdON = false;
    //event = click
    
    //console.log("button pressed"); //tests
    // Create and append the buttons
    var buttonID = event.target.getAttribute('id');
    var semForm = event.target.parentNode;
    console.log("button name: ", buttonID); //test
    console.log("form number: ", semForm.getAttribute('id')); //test
    
    
    // Create a "stop" button
    var stopCharIDTaskButton = document.createElement("BUTTON");
    stopCharIDTaskButton.innerHTML = "All Characters Indicated";
    stopCharIDTaskButton.setAttribute("class", "charIDStopButton");
    stopCharIDTaskButton.setAttribute("id", "stopCharIDTaskButton" + semForm.getAttribute("id"));
    stopCharIDTaskButton.setAttribute("onclick", "stopCharIDTask(event)");
    semForm.insertBefore(stopCharIDTaskButton, document.getElementById(buttonID).nextSibling);
    
    
    // Give simple mouse click instruction
    var charClickInstructions = document.createElement("p");
    charClickInstructions.innerHTML = "Click on all the characters in the panel.";
    charClickInstructions.setAttribute("id", "charClickInstructions" + semForm.getAttribute("id"));
    semForm.insertBefore(charClickInstructions, document.getElementById(buttonID).nextSibling);
    
    // Create a "clear all" button(?)
    

    
    // Turn on ability to click on the canvas
    startCharIDTask(event);
    
    // Start click char task button
    //var startTaskCharID = document.createElement("BUTTON");
    //startTaskCharID.innerHTML = "Turn On Mouse Click";
    //startTaskCharID.setAttribute("id", "startTaskCharID" + semForm.getAttribute("id"));
    //startTaskCharID.setAttribute("class","panelIDButtons");
    //startTaskCharID.setAttribute("onclick", "startCharIDTask(event)");
    // Append the button to the semantic form
    //semForm.insertBefore(startTaskCharID, document.getElementById(buttonID).nextSibling);
    currentPanel = semForm;
    
    // Disable currently pressed newChar button
    document.getElementById(buttonID).setAttribute("onclick", "true");
}



/* Start Char ID Task - Function to enable clicking on the canvas */
function startCharIDTask(event) {
    if (charIdON){
        return;   //stopping it regenerating if in the middle of clicking
    }
    //event = click
    charIdON = true;
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
    
    // Track the click nums
    charClickNum +=1;
    // When mouse down, get the coords of the click
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // tell the browser we're handling this event
    event.preventDefault();
    event.stopPropagation();

    coordX = parseInt(event.clientX - recOffsetX);
    coordY = parseInt(event.clientY - recOffsetY);
    console.log(coordX + ", " + coordY); //test, check the mousedown coords
    
    // Put down a circle with number of the char
    context.beginPath(); // draw circle
    context.arc(coordX, coordY, 25, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "blue";
    context.fill();
    console.log("circle created");
    
    // Create a new form with the char number/ID
    var charForm = document.createElement("form");
    charForm.setAttribute('method',"post");
    charForm.setAttribute('action',"true");
    charForm.id = "charForm" + charClickNum;
    
    var charFormInput = document.createElement("input"); //input element, text box
    charFormInput.setAttribute('type',"text");
    charFormInput.setAttribute('name',"characterDescription");
    charFormInput.value = "variable (e.g. x1, x2)";
    charFormInput.setAttribute("id", "charFormInput" + charClickNum);
    var inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", "charFormInput" + charClickNum);
    inputLabel.innerHTML = "Character Variable: ";
    console.log("char input ID: " + charFormInput.id); //test
    
    // Char variable confirmation button
    var charFormInputConfirmButton = document.createElement("input");
    charFormInputConfirmButton.setAttribute("type", "button");
    charFormInputConfirmButton.setAttribute("value", "Confirm");
    charFormInputConfirmButton.setAttribute("id", charClickNum);
    charFormInputConfirmButton.setAttribute("onclick", "confirmCharButton(event)");
    
    
    
    //var s = document.createElement("input"); //input element, Submit button
    //s.setAttribute('type',"submit");
    //s.setAttribute('value',"Submit");
    
    // Create radio buttons for on/off panel chars
    var r1 = document.createElement("input"); // on panel radio button
    r1.setAttribute("type", "radio");
    r1.setAttribute("id", "onPanel");
    r1.setAttribute("name", "onOffPanel");
    r1.setAttribute("value", "onPanel");
    
    var l1 = document.createElement("label");
    l1.setAttribute("for", "onPanel");
    //l1.appendChild(r1);
    l1.innerHTML = "On Panel";
    
    var r2 = document.createElement("input"); // off panel radio button
    r2.setAttribute("type", "radio");
    r2.setAttribute("id", "offPanel");
    r2.setAttribute("name", "onOffPanel");
    r2.setAttribute("value", "offPanel");
    
    var l2 = document.createElement("label");
    l2.setAttribute("for", "offPanel");
    l2.innerHTML = "Off Panel";
    
    
    // Append to the form element
    charForm.appendChild(inputLabel);
    charForm.appendChild(charFormInput);
    charForm.appendChild(charFormInputConfirmButton);
    charForm.appendChild(r1);
    charForm.appendChild(l1);
    charForm.appendChild(r2);
    charForm.appendChild(l2);
    
    
    // Append the form element to the bottom of the paragraph instructions on the panel semantic form
    var p = document.getElementById("stopCharIDTaskButton" + currentPanel.getAttribute("id"));
    console.log("form id: " + charForm.id); //test
    console.log("char click num: " + charClickNum)
    // Just append the form that corresponds with current click num
    //currentForm = charForm;
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(charForm, p);
}




/* Function - Confirm Char variable name button */
// Move the variable name inputted in form to the canvas
function confirmCharButton(event) {
    //event = button click
    
    // Get the value in the associated text input box - if it is empty or not filled out, return the function
    
    var charFormInput = document.getElementById("charFormInput" + event.target.getAttribute('id'));
    var inputValue = charFormInput.value;
    if (inputValue.length == 0) {
        return;
    }
    console.log("value: " + inputValue); //test
    
    // Place that text on the associated circle on the canvas
    
}





/* End Char ID Task - Function to turn off the  create a blank form per character */
function stopCharIDTask(event) {
    // event = click
    charIdON = false;
    charClickNum = 0;

    // Destroy previous newChar button element
    //var buttonID = event.target.getAttribute('id');
    //var semForm = event.target.parentNode;
    //console.log("button name: ", buttonID); //test
    //console.log("form number: ", semForm.getAttribute('id')); //test
    //semForm.removeChild(semForm.childNodes[2]);
    
    //document.getElementById(buttonID).setAttribute("onclick", "true");
    
    // remove  event handler for char clicks
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.removeEventListener("mousedown", charIDTask);
    
    
    // Put the old mousedown listener event back - the panel ID event listener
    canvas.addEventListener("mousedown",
                            drawRectangleOnCanvas.handleMouseDown,
                            false);
    
    
    
    // Create the Background Section
    // Create a new form with the background number/ID
    var g = document.createElement("form"); // Location
    g.setAttribute('method',"post");
    g.setAttribute('action',"true");
    
    var i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('name',"charactertype");
    
    g.appendChild(i); // append to the form element
    
    // Append to the panel semantic form
    document.getElementById(currentPanel.getAttribute('id')).appendChild(g);
    
    // Create a new form element for the below radio buttons
    var g2 = document.createElement("form"); // Background detail radio buttons
    g2.setAttribute('method',"post");
    g2.setAttribute('action',"true");
    
    // Add background detail radio buttons
    var b1 = document.createElement("input"); // blank background radio button
    b1.setAttribute("type", "radio");
    b1.setAttribute("id", "blankDetail");
    b1.setAttribute("name", "backgroundDetail");
    b1.setAttribute("value", "blankBackground");
    
    var k1 = document.createElement("label");
    k1.setAttribute("for", "blankBackground");
    k1.innerHTML = "Blank/Empty";
    
    var b2 = document.createElement("input"); // light detail background radio button
    b2.setAttribute("type", "radio");
    b2.setAttribute("id", "lightDetail");
    b2.setAttribute("name", "backgroundDetail");
    b2.setAttribute("value", "lightlyDetailedBackground");
    
    var k2 = document.createElement("label");
    k2.setAttribute("for", "lightlyDetailedBackground");
    k2.innerHTML = "Light Detail";
    
    var b3 = document.createElement("input"); // fully drawn background radio button
    b3.setAttribute("type", "radio");
    b3.setAttribute("id", "fullyDrawn");
    b3.setAttribute("name", "backgroundDetail");
    b3.setAttribute("value", "fullyDrawnBackground");
    
    var k3 = document.createElement("label");
    k3.setAttribute("for", "fullyDrawnBackground");
    k3.innerHTML = "Fully Drawn";
    
    
    g2.appendChild(b1);  // append to the form element
    g2.appendChild(k1);
    g2.appendChild(b2);
    g2.appendChild(k2);
    g2.appendChild(b3);
    g2.appendChild(k3);
    
    document.getElementById(currentPanel.getAttribute('id')).appendChild(g2);
    
    
    
    var semForm = event.target.parentNode;
    console.log("form number: ", semForm.getAttribute('id')); //test
    //semForm.removeChild(semForm.childNodes[2]);
    
    var newCharButton = semForm.childNodes[2];
    newCharButton.setAttribute("onclick","startIndividualCharID(event)");
    
    
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









