


/* GLOBAL VARIABLES */

// Declare canvas configuration variables
var canvas, context;

// Initialize an array to hold preloaded comic page images
var comicPages = [];

// Declare the index in the array to retrieve comic pages in order
var pageNum;


// Drawing Rectangles - Variables for drawing on canvas
var isRecDown = false;
var startX, startY;

var rects = []; // Individual page data - store rect info per page
var newRect;
var pagesData = []; // Array to store data for each comic page

var drawRectsON = false;

// Create buttons
buttonsCreated = false;


// Index for the number of panels indicated in the panelIndicationByUser function
// NOTE - these variables are local in the functions below, and it seems to work better this way!
//var panelRecNum = 1;
//var panelRecNumStored;










/* CANVAS and COMIC PAGES SETUP */
/* code references
 initializing the canvas: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
 mouse position on canvas:
 https://codepen.io/chrisjaime/pen/lcEpn?editors=1111
 */


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


/* Function to preload the comic page images */
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


/* Function to add first comic page image to the canvas, setup the page */
// The argument pageNum is the index in the array that you want to
function putFirstComicPageOnCanvas() {
    pageNum = 0;
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the preloaded comic page image on the canvas
    context.drawImage(comicPages[pageNum],0, 0, 500, 700);
    // Reveal the next section on the semantic form
    document.getElementById("panelIdSection").style.display = "block";
    // Change the 'Start Annotation' button to 'Page 1' heading
    var startAnnotationButton = document.getElementById("startAnnotation");
    startAnnotationButton.innerHTML = "Page 1";
    startAnnotationButton.style.cursor = "default";
    // Turn off the button's onlick capabilties
    startAnnotationButton.setAttribute("onclick", "true");
    console.log("After Start Annotation Button, pageNum is " + pageNum); //test
}


/* Function to put a comic page on canvas (after first page) according to the sequence in comicPages and pageNum */
function putComicPageOnCanvas(event) {
    // Store the current page information, rects and form
    if (pagesData.length < pageNum+1) {
        pagesData.push({});
    }
    pagesData[pageNum].rects = rects;
    for (var i=0; i < pagesData.length; i++) {
        for (var j=0; j < pagesData[i].rects.length; j++ ) {
            console.log(pagesData[i].rects[j]);
        }
    }
    
    //pagesData.push(["Page " + pageNum, rects]);
    //console.log(pagesData[pageNum]); // For now, check data is stored on console
    
    pageNum += 1;
    console.log("After next page, pageNum is: " + pageNum);
    
    // First, check whether this is the last page. If so, reset bottom buttons
    if (pageNum == comicPages.length-1) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Submit";
        buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
    }
    removeSemanticForms(); // Clear the submission forms
    //pageNum += 1; // Index to next page
    rects = []; // Clear the comic image and data stored
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.drawImage(comicPages[pageNum], 0, 0, 500, 700); // Draw the comic page
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotation").innerHTML = "Page " + pageNumTitle;
}


/* Function to put the previous page on the canvas according to the current pageNum */
function putPreviousPageOnCanvas(event) {
    // First check if this is the first page in the comicPages sequence, and if so just return the function
    if (pageNum == 0) {
        return
    }
    pageNum -= 1; // Decrement pageNum index
    console.log("Previous Page pageNum = " + pageNum);
    removeSemanticForms(); // Clear the submission forms
    rects = []; // Clear the comic image and data stored
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.drawImage(comicPages[pageNum], 0, 0, 500, 700); // Draw the comic page previous to the indicated comic page in pageNum
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
    },


    drawAll: function() {
        if (!drawRectsON) {
            return;
        }
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Draw function pageNum: " + pageNum); //test
        context.drawImage(comicPages[pageNum],0, 0, 500, 700);
        context.lineWidth = 4;
        for (var i=0; i<rects.length; i++) {
            var r = rects[i];
            context.strokeStyle = r.color;
            context.globalAlpha = 1; // set transparency value
            context.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    
            context.beginPath();
            context.arc(r.left, r.top, 15, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = r.color;
            context.fill();
    
            var text = drawCount;
            context.fillStyle = "#fff";
            var font = "bold " + 2 + "px serif";
            context.font = font;
            var width = context.measureText(text).width;
            var height = context.measureText("w").width; // this is a GUESS of height
            context.fillText(text, r.left - (width / 2), r.top + (height / 2));
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
    console.log("After End Button, pageNum is " + pageNum); //test
}


/* Function to clear the drawn rectangles, restart the task */
function recordRectsCLEAR(event) {
    //event = button clock
    // Clear the rectangles already drawn on the comic image
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],0, 0, 500, 700);
    // Clear the collected panel/sections info
    rects = [];
}











/* SEMANTIC FORM CREATION and SUBMISSION */

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
    document.getElementById("semanticSection").appendChild(buttonPreviousPage);
    
    // Add event handler to the submission button
    //buttonSubmit.addEventListener("click:, function() { write function here });
    
    // Create and append a button to reset all the contents of the semantic forms
    var buttonReset = document.createElement("BUTTON");
    buttonReset.innerHTML = "Reset";
    buttonReset.setAttribute("id", "buttonReset");
    buttonReset.setAttribute("onclick", "resetSemanticForm(event)");
    buttonReset.setAttribute("class","panelIDButtons");
    document.getElementById("semanticSection").appendChild(buttonReset);
    
    // Add event handler to the reset button button
    //buttonReset.addEventListener("click:, function() { write function here });
    
    // Create and append a button to go to the next comic page
    var buttonNextPage = document.createElement("BUTTON");
    buttonNextPage.innerHTML = "Next Page";
    buttonNextPage.setAttribute("id", "buttonNextPage");
    buttonNextPage.setAttribute("class","panelIDButtons");
    document.getElementById("semanticSection").appendChild(buttonNextPage);
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





