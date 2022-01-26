
/* GLOBAL VARIABLES */


// Variables for setting up the CAT with the participant num, story num, and
// correct annotation task --------------------------------

// Get participant num, story num, and annotation type from local storage
var participantNum = localStorage.getItem("participantNumKey");
var storyNum = localStorage.getItem("storyNumKey");
var annotationType = localStorage.getItem("annotationTypeKey");
var URL = localStorage.getItem("URL");
var consent_check = localStorage.getItem("consent_check_key"); 

// check that these variables made it over from the index:
console.log("participant number: " + participantNum);
console.log("story number: " + storyNum);
console.log("annotation type: " + annotationType);
console.log("URL: " + URL);
console.log("consent check: " + consent_check);

//var dataName = "story" + storyNum + "Participant" + participantNum; // init variable to assign a name of the data in firebase

//console.log(dataName);


// Store the number of pages for each story as a dict object -
//    Story number : Number of pages
//    not a great way to do it, but it's what it is! ----------------
var storyPageLengths = {
    1 : 5,
    2 : 5,
    3 : 5,
    4 : 5,
    5 : 2,
    6 : 6,
    7 : 4,
    8 : 5,
    9 : 2,
    10 : 5,
    11 : 5,
    12 : 5,
    13 : 2,
    14 : 5,
    15 : 5,
    16 : 6,
    17 : 2,
    18 : 4,
    19 : 5,
    20 : 5,
    21 : 5,
    22 : 1,
    23 : 1,
    24 : 5,
    25 : 5,
    26 : 5,
    27 : 5,
    28 : 2,
    29 : 5,
    30 : 5,
    31 : 5,
    32 : 1,
    33 : 6
};



// Switches for stages of annotation to determine which parts of the CAT should be shown
var pageSegmentationTaskSwitch = false;
var characterSegmentationTaskSwitch = false;
var textSectionsTaskSwitch = false;
var characterFeaturesTaskSwitch = false;
var backgroundLocationTaskSwitch = false;


var annotationTaskCompleted = ""; // init string variable to identify which task was just completed for the 'final data' section in pagesData before its submitted to firebase



// Variables for the mechanics of the CAT ------------------------

// Declare canvas configuration variables
var canvas, context;

// Initialize an array to hold preloaded comic page images
var comicPages = [];

// Init array to hold any other preloaded images
var images = [];

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

var timeout = null; // init a timeout variable

// Declare charBodyImage canvas elements
var canvas_charBodyImage, context_charBodyImage;

var charBodyMapImage; // Declare the charBodyImage var

var charCanvasAreasList = [] // init empty list to hold list of clickable areas on the charBodyImage canvases

// Declare charOrientation canvas elements
var canvas_charOrientation, context_charOrientation;

//var errorFound = false; // init a switch to track if an error is found in the validateInput function - this is used to track things in the drawCharacters function



// Preset value for char and description inputs
const charLabelInstruction = "One variable (e.g. x1)";
const charDescriptionInstruction = "Nouns and Adjs (e.g. short girl)";
const charActionInstruction = "Several words (e.g. running away)";
const backgroundLabelInstruction = "One variable (e.g. L1)"
const backgroundLocationInstruction = "Several words (e.g. forest)";
const speechTextCharInstruction = "Character variable";
const textSpeechInstruction = "Associated character variable"
const otherTextInstruction = "One or two words (e.g. Title)"
const indicateCharInstructions = "";




/* ANNOTATION TASK DESIGNATION - before INITIALIZATION */

// turn on the correct switch to start the annotation task

if (annotationType == "Page Segmentation") {
    pageSegmentationTaskSwitch = true; // turn on page segmentation task switch
    annotationTaskCompleted = "Page Segmentation"; // assign correct annotation task
    document.getElementById("startAnnotationButton").style.display = "inline-block";
} // end page segmentation task setup

if (annotationType == "Background and Location") {
    backgroundLocationTaskSwitch = true; // turn on the background_location task
    
    // retrieve the corrent document from firebase and assign to pagesData
    
    // Get the appropriate page segmentation annotated pages from Firebase
    db.collection("Background_Experiment6").get().then((snapshot) => {
                                                    console.log(snapshot.docs); // get an overview of all the documents in the database
                                                    snapshot.docs.forEach(doc => {
                                                                          //console.log(doc.data());
                                                                          //console.log("data id: ", doc.id)
                                                                          retrieveCorrectPagesData(doc);
                                                                          document.getElementById("startAnnotationButton").style.display = "inline-block";
                                                                          })
                                                    })
    
    //console.log("before: " + annotationTaskCompleted);
    annotationTaskCompleted = "Background and Location"; // assign correct annotation task
    console.log("annotation task completed: " + annotationTaskCompleted);
    if (pagesData == []) {
        console.log("pagesData not assigned"); // send alert message if pagesData has not been assigned
    }
    
} // end background and location task setup


if (annotationType == "Character Segmentation") {
    characterSegmentationTaskSwitch = true; // turn on character task switch
    
    // retrieve the corrent document from firebase and assign to pagesData
    
    // Get the appropriate page segmentation annotated pages from Firebase
    db.collection("Background_Experiment6").get().then((snapshot) => {
                                            console.log(snapshot.docs); // get an overview of all the documents in the database
                                            snapshot.docs.forEach(doc => {
                                                                //console.log(doc.data());
                                                        //console.log("data id: ", doc.id)
                                                                  retrieveCorrectPagesData(doc);
                                                                  document.getElementById("startAnnotationButton").style.display = "inline-block";
                                                                  })
                                            })
    
    //console.log("before: " + annotationTaskCompleted);
    annotationTaskCompleted = "Character Segmentation"; // assign correct annotation task
    console.log("annotation task completed: " + annotationTaskCompleted);
    if (pagesData == []) {
        console.log("pagesData not assigned"); // send alert message if pagesData has not been assigned
    }
} // end character segmentation task setup



if (annotationType == "Character Features") {
    characterFeaturesTaskSwitch = true; // turn on the character features task switch
    
    // retrieve the corrent document from firebase and assign to pagesData
    
    // Get the appropriate page segmentation annotated pages from Firebase
    db.collection("Background_Experiment6").get().then((snapshot) => {
                                            console.log(snapshot.docs); // get an overview of all the documents in the database
                                            snapshot.docs.forEach(doc => {
                                                                  //console.log(doc.data());
                                                                  //console.log("data id: ", doc.id)
                                                                  retrieveCorrectPagesData(doc);
                                                                  document.getElementById("startAnnotationButton").style.display = "inline-block";
                                                                  })
                                            })
    
    //console.log("before: " + annotationTaskCompleted);
    annotationTaskCompleted = "Character Features"; // assign correct annotation task
    console.log("annotation task completed: " + annotationTaskCompleted);
    if (pagesData == []) {
        console.log("pagesData not assigned"); // send alert message if pagesData has not been assigned
    }
} // end character feature task setup



if (annotationType == "Text Sections") {
    textSectionsTaskSwitch = true // turn on text sections task switch
    
    // retrieve the corrent document from firebase and assign to pagesData
    
    // Get the appropriate page segmentation annotated pages from Firebase
    db.collection("Background_Experiment6").get().then((snapshot) => {
                                            console.log(snapshot.docs); // get an overview of all the documents in the database
                                            snapshot.docs.forEach(doc => {
                                                                  //console.log(doc.data());
                                                                  //console.log("data id: ", doc.id)
                                                                  retrieveCorrectPagesData(doc);
                                                                  document.getElementById("startAnnotationButton").style.display = "inline-block";
                                                                  })
                                            })
    annotationTaskCompleted = "Text Sections" // assign correct annotation task
} // end text section task setup



/* Function to find the correct pagesData json document in the Firebase DB */
// takes in each doc from the snapshot
function retrieveCorrectPagesData(doc) {
    //console.log(doc.data()); // show the data from each document in the database
    docItem = doc.data(); // assign a name to the data
    //console.log(docItem); // debugging checks
    //console.log(typeof docItem);
    //console.log(docItem.jsonData);
    
    mainData = docItem.jsonData; // mainData is type string
    //console.log(mainData); // check the mainData in the console log
    //console.log(typeof mainData);
    
    // check whether the story num, participant num, and last annotation task (if applicable) are in the mainData:
    var storyNumLabel = String('"storyID":"' + storyNum + '"');
    //console.log(storyNumLabel);
    var checkStoryNum = mainData.includes(storyNumLabel);
    //console.log("storyNum check: " + checkStoryNum);
    
    var participantNumLabel = String('"participantNum":"' + participantNum + '"');
    //console.log(participantNumLabel);
    var checkParticipantNum = mainData.includes(participantNumLabel);
    //console.log("participantNum check: " + checkParticipantNum);
    
    // if the annotation task is Background and Location task, then check that the lastAnnotationCompleted is for Page Segmentation
    if (annotationType == "Background and Location") {
        
        var annotationLastTaskCompletedLabel = String('annotationLastCompleted":"' + "Page Segmentation" + '"');
        //console.log(annotationLastTaskCompletedLabel);
        var checkAnnotationLastCompleted = mainData.includes(annotationLastTaskCompletedLabel);
        //console.log("last annotation task check: " + checkAnnotationLastCompleted);
    }
    
    // if the annotation task is Character Segmentation, then check that the annotationLastCompleted is for Page Segmentation
    if (annotationType == "Character Segmentation") {
        
        var annotationLastTaskCompletedLabel = String('annotationLastCompleted":"' + "Page Segmentation" + '"');
        //console.log(annotationLastTaskCompletedLabel);
        var checkAnnotationLastCompleted = mainData.includes(annotationLastTaskCompletedLabel);
        //console.log("last annotation task check: " + checkAnnotationLastCompleted);
    }
    
    // if the annotation task is Character Features, then check that the annotationLastCompleted is for Character Segmentation
    if (annotationType == "Character Features") {
        
        var annotationLastTaskCompletedLabel = String('annotationLastCompleted":"' + "Character Segmentation" + '"');
        
        var checkAnnotationLastCompleted = mainData.includes(annotationLastTaskCompletedLabel);
    }
    
    
    // if the annotation task is Text Sections, then check that the annotationLastCompleted is for Page Segmentation
    if (annotationType == "Text Sections") {
        
        var annotationLastTaskCompletedLabel = String('annotationLastCompleted":"' + "Page Segmentation" + '"');
        //console.log(annotationLastTaskCompletedLabel);
        var checkAnnotationLastCompleted = mainData.includes(annotationLastTaskCompletedLabel);
        //console.log("last annotation task check: " + checkAnnotationLastCompleted);
    }
    
    if (checkStoryNum == true && checkParticipantNum == true & checkAnnotationLastCompleted == true) {
        // assign the correct string to pagesData
        pagesDataJson = JSON.parse(mainData);
        
        //console.log(pagesDataJson["pagesData"]);
        //console.log(pagesDataJson);
        
        pagesData = pagesDataJson["pagesData"];
        //console.log(pagesData);
    }
    
} // end of function retrieveCorrectPagesData(doc)



/* CANVAS and COMIC PAGES SETUP */
/* code references
 initializing the canvas: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
 mouse position on canvas:
 https://codepen.io/chrisjaime/pen/lcEpn?editors=1111
 */

/* INITIALIZATION of the WEBPAGE, COMIC STORY IMAGES, and CANVAS */

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
    console.log("comic page image sizes readjusted");
    addCanvasEvents(); // Add event listeners for rectangle drawing tool to the canvas
    
    // if this is a polygon segmentation task run, put on the keypress event listener
    if (false) {
        document.addEventListener("keydown", function(e) {
                                  drawPolygonsOnCanvas.deleteKey(e);
                                  }, false);
    }
    
    // replace the below with characterFeaturesTaskSwitch == true for char features task
    if (false) {
        canvas_charBodyImage = document.createElement('canvas'); // assign canvas to global variable
        context_charBodyImage = canvas_charBodyImage.getContext("2d"); // add context to the canvas element
        canvas_charBodyImage.width = 125; // set width
        canvas_charBodyImage.height = 300; // set height
        canvas_charOrientation = document.createElement('canvas'); // assign canvas to global variable
        context_charOrientation = canvas_charOrientation.getContext("2d"); // add context to the canvas element
        canvas_charOrientation.width = 200; // set width
        canvas_charOrientation.height = 200; // set height
    }
} // end function init()



/* Adjust image sizes for all preloaded images during init */
// Previous setup: this is specific for the example image set to be 90% the size of the canvas - height: 680, width: 500
function adjustImageSizes() {
    for (var i=0; i < comicPages.length; i++) {
        comicPages[i].height = 750;
        comicPages[i].width = 575; // Normally 575 - for C&H example, it's 600
    }
} // end function adjustImageSizes()



/* Setup the argument for the preload variable
    This will allow for comic stories of varous page lengths to be preloaded */
function setupPreloadArgument(storyNum) {
    preloadArguments = []; // init an empty list to hold string names
    var storyLen = storyPageLengths[storyNum] // get the story length from the storyNum
    for (var i=0; i < storyLen; i++) {
        preloadArguments[i] = "comicPages/Story" + storyNum + "/Page" + (i+1) + ".jpeg";
        //console.log(preloadArguments[i]);
    }
    return preloadArguments
} // end of setupPreloadArgument(storyNum)

//var test = setupPreloadArgument(storyNum);
//console.log(test)



/* Preload the comic page images and set their sizes */
function preload_story(listOfStoryFileStrings) {
    for (var i=0; i < listOfStoryFileStrings.length; i++) {
        comicPages[i] = new Image();
        comicPages[i].src = listOfStoryFileStrings[i];
        console.log("story images preloaded.");
    }
} // end of preload_story(listOfStoryFileStrings)


/* Preload char body map image */
function preload_other() {
    console.log("no other images to preload.");
    //charBodyMapImage = new Image();
    //charBodyMapImage.src = "bodyMapImages/charBodyMap_resize.jpeg";
    //console.log("char body map image preloaded");
    //charOrientationImage = new Image();
    //charOrientationImage.src = "bodyMapImages/Kenon.jpeg";
    //console.log("char orientation image preloaded");
} // end of preload_other(listOfImageFileStrings)



/* Preload comic pages - and preload other required images */
var preloadArgument = setupPreloadArgument(storyNum); // create the list of strings with the correct story and number of pages
preload_story(preloadArgument); // preload all comic pages
preload_other(); // preload char body map image and char orientation image



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
    
} // end of putComicPageOnCanvas()


/* Add first comic page image to the canvas, add a new entry to the list that stores all data */
function putFirstComicPageOnCanvas() {
    
    pageNum = 0;
    putComicPageOnCanvas();
    
    if (pageSegmentationTaskSwitch == true) {
    
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
        pagesData.push({}); // push new dict
        pagesData[pageNum].panels = []; // add new list for empty panels
    }
    if (backgroundLocationTaskSwitch == true) {
        setupPageForAnnotation();
    }
    
    if (characterSegmentationTaskSwitch == true) {
        setupPageForAnnotation();
    }
    
    if (characterFeaturesTaskSwitch == true) {
        setupPageForAnnotation();
    }
    
    if (textSectionsTaskSwitch == true) {
        setupPageForAnnotation();
    }
} // end of putFirstComicPageOnCanvas()


/* Setup function for annotation tasks */
function setupPageForAnnotation() {
    // Change the Start Annotation button to a page number display
    var startAnnotationButton = document.getElementById("startAnnotationButton");
    startAnnotationButton.innerHTML = "Page 1 of " + comicPages.length;
    startAnnotationButton.style.cursor = "default";
    //startAnnotationButton.style.backgroundColor = "#006080";
    startAnnotationButton.setAttribute("onclick", "true");         // Turn off the button's onlick capabilties
    
    // pagesData should be correctly assigned, so...
    //console.log(pagesData); // check pagesData is correct
    
    drawPanelInfoOnCanvas(); // Put stored panel rects on canvas
    
    // display the semantic forms:
    document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
    panelRecNum = pagesData[pageNum].panels.length + 1;
    panelCounter(panelRecNum-1); // turn off the panel counter function
    showContentForms(panelRecNum-1); // show content forms
    
    // Alternative method to get the semantic forms:
    // get the number of segmentations outlined on page one from pagesData
    //numRectsPage1 = pagesData[1]["panels"];
    //console.log(numRectsPage1.length); // debug check that this is the correct number of segmentations
    
    // show the semantic forms for each segmentation
    //showContentForms(panel); //
    
    // Add navigation buttons:
    // Only create buttons at the bottom page when this function runs for the first page
    if (document.getElementById("startAnnotationButton").innerHTML == "Page 1 of " + comicPages.length && !navigationButtonsCreated) {
        createNavigationButtons();
        navigationButtonsCreated = true;
    }
} // end of setupPageForAnnotation()



/* When Next Page button is pressed */
function nextPage(event) {
    
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
    
    // Check whether this is the last page, or if the story only has one page. If so, reset bottom buttons
    //console.log(pageNum);
    //console.log(comicPages.length-2);
    if (pageNum == comicPages.length-2) {
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Last Page: Submit All Annotations";
        buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
    } else {
        // if not last one then just next page button
        buttonChange = document.getElementById("buttonNextPage");
        buttonChange.innerHTML = "Next Page";
        buttonChange.setAttribute("onclick", "nextPage(event)");
    }
    
    // For Page Segementation Task, show the panel ID buttons
        // Setup panel ID button situation
    if (pageSegmentationTaskSwitch == true) {
        if (lastThreePanelIDButtonsVisible) {
            lastThreePanelIDButtonsVisible = true;
            document.getElementById("clearLastRectButton").style.display = "inline-block";
            document.getElementById("clearButton").style.display = "inline-block";
            document.getElementById("endButton").style.display = "inline-block";
        }
    } else {
        if (lastThreePanelIDButtonsVisible) {
            lastThreePanelIDButtonsVisible = false;
            document.getElementById("clearLastRectButton").style.display = "none";
            document.getElementById("clearButton").style.display = "none";
            document.getElementById("endButton").style.display = "none";
        }
    }
    
    // Put the scroll on the semantic forms section
    if (scrollON) {
        scrollON = false;
        document.getElementById("semanticFormContainer").setAttribute("class","true");
    }
    
    //console.log("number of comic pages: " + comicPages.length); // debugging
    //console.log(pagesData[pageNum].panels);
    
    // Go to next page
    pageNum += 1;
    charIdON = false;  // turn off all (panel ID, char ID, text ID) event handlers
    drawRectsON = false;
    textIdON = false;
    removeSemanticForms(); // Clear the panel submission forms
    putComicPageOnCanvas(); // Put next page on canvas
    
    //console.log(pagesData[pageNum].panels);
    
    // Change the page number indicator at the top of the web page
    pageNumTitle = pageNum + 1;
    document.getElementById("startAnnotationButton").innerHTML = "Page " + pageNumTitle + " of " + comicPages.length;
    // Show the panel demarcation section with the buttons
    panelButtonsVisible = true;
    document.getElementById("panelIdSection").style.display = "block";
    // But hide all buttons but Start Task button (until Start Button pressed)
    
    // For Character Segmentation task,
    // display the semantic forms
    if (characterSegmentationTaskSwitch == true) {
        // display the semantic forms:
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
    }
    
    // For Character Features task,
    // display the semantic forms
    if (characterFeaturesTaskSwitch == true) {
        // display the semantic forms:
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
    }
    
    // For Text Section Annotation task,
    // display the semantic forms
    if (textSectionsTaskSwitch == true) {
        // display the semantic forms:
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
    }
    
    // For Background/Location task,
    // display the semantic forms
    if (backgroundLocationTaskSwitch == true) {
        panelButtonsVisible = false;
        document.getElementById("panelIdSection").style.display = "none";
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        drawPanelInfoOnCanvas();
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
        
    } // end of if backgroundLocationTaskSwitch == true
    
    // If this is a revisit to a page, populate with right info - elements from the stored semantic container
    // This only works for new segmentation tasks, and not tasks that have already been segmented!!!

    if ((pageNum+1) <= pagesData.length) {
        drawPanelInfoOnCanvas();
        drawCharacterInfoOnCanvas();
        drawTextSectionInfoOnCanvas();
        
        //console.log("Redraw section here.");
        // if there are panels, redraw the char instruction panel
        // and get rid of panel instruction form
        if (pagesData[pageNum].panels.length>0){
            
            panelButtonsVisible = false;
            document.getElementById("panelIdSection").style.display = "none";
            panelCounter(pagesData[pageNum].panels.length);
            
        }
        //console.log(pagesData[pageNum]);
        //console.log(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true));
        
        // replace semantic form container with the stored one
        // This has been causing an error, and I don't think it's being used anymore, so it's commented out...
        //var parent = document.getElementById("semanticFormContainer").parentNode;
        //parent.replaceChild(pagesData[pageNum].storedSemanticFormContainer.cloneNode(true), document.getElementById("semanticFormContainer"));
        
        // if the charFeaturesTaskSwitch is on, put the canvas and mouseclick eventlisteners on the semantic forms
        if (characterFeaturesTaskSwitch == true) {
            // add the canvas images and mouse click event listener:
            
            drawCharacterInfoOnCanvas(true);
            
            // get the original emotion value per section
            for (var p=0; p<pagesData[pageNum].panels.length; p++) {
                for (var c=0; c<pagesData[pageNum].panels[p].characters.length; c++) {
                    var getEmotionInput = document.getElementById("charEmotionSelect" + (p+1) + "." + c);
                    //console.log(p);
                    //console.log(c);
                    var emotionValue = pagesData[pageNum].panels[p].characters[c].emotion;
                    
                    getEmotionInput.value = emotionValue;
                    //console.log(emotionValue);
                    
                    console.log("after next page");
                    console.log(pagesData[pageNum].panels[p].characters[c]);
                    console.log(getEmotionInput.id);
                }
            } // end of for loop
            var canvases = document.getElementsByTagName('canvas'); // get all canvases
            var numCanvases = canvases.length;
            //console.log("num canvases: " + numCanvases);
    
            for (var i=0; i<numCanvases; i++) {
                if (canvases[i].id.includes("canvas_charBodyImage")) {
                    canvases[i].getContext('2d').drawImage(charBodyMapImage, 0, 0, 125, 300); // add the image to each canvas
                    var canvasNum = canvases[i].id.replace("canvas_charBodyImage", "");
                    //console.log("canvasNum: " + canvasNum);
                    var panelNum = parseInt(canvasNum.split(".")[1]-1);
                    //console.log("panelNum: " + panelNum);
                    var charFigureNum = parseInt(canvasNum.split(".")[2]);
                    drawSelectedAreasOnCharBodyImage(canvases[i], panelNum, charFigureNum);
                    //console.log(pagesData[pageNum].panels[panelNum].characters);
                    // add mouse click event listener to each canvas
                    canvases[i].addEventListener('mousedown', function(e) {handleMouseClick(e)
                                                 });
                }
                if (canvases[i].id.includes("canvas_charOrientation")) {
                    context_of_charOrientation = canvases[i].getContext('2d');
                    // put in the white background
                    context_of_charOrientation.fillStyle = "white";
                    context_of_charOrientation.fillRect(0, 0, canvas.width, canvas.height);
                    context_of_charOrientation.restore();
                    // put the purple circle
                    context_of_charOrientation.beginPath();
                    context_of_charOrientation.arc(cx, cy, 80, 0, 2 * Math.PI, false);
                    context_of_charOrientation.fillStyle = '#7E06DA';
                    context_of_charOrientation.fill();
                    context_of_charOrientation.restore();
                    // put the little rectangle
                    context_of_charOrientation.beginPath();
                    context_of_charOrientation.rect(80, 190, 40, 40);
                    context_of_charOrientation.fillStyle = '#7E06DA';
                    context_of_charOrientation.fill();
                    context_of_charOrientation.restore();
        
                    drawOrientationImage(canvases[i].id);

               }
                    
                    // add event listeners
                    canvases[i].addEventListener('mousedown', function(e) {rotateImage.handleMouseDown(e)});
                    canvases[i].addEventListener('mousemove', function(e) {rotateImage.handleMouseMove(e)});
                    canvases[i].addEventListener('mouseup', function(e) {rotateImage.handleMouseUp(e)});
                    canvases[i].addEventListener('mouseout', function(e) {rotateImage.handleMouseOut(e)});
            }
        } // end of if characterFeaturesTaskSwitch == true
    } else {
        // else if new page push new dict and add empty panels
        // put check if it is a task that doesn't need new panels
        //console.log(pagesData(pageNum));
        if (backgroundLocationTaskSwitch == false) {
            pagesData.push({});
            pagesData[pageNum].panels = [];
        }
    }
    
} // end of nextPage(event)



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
    
    // Before moving to the previous page, for backgroundLocationTask store the values on this current page!
    if (backgroundLocationTaskSwitch == true) {
        validateInputs();
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
    
    // If backgroundLocation task, store the values on the current page
    if (backgroundLocationTaskSwitch == true) {
        panelButtonsVisible = false;
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var panel = pagesData[pageNum].panels[i];
            var panel_background = panel["background"];
            var slider_item = document.getElementById("slider" + pageNum + "." + (i+1));
            var detail_value = slider_item.value;
            panel_background["detail"] = detail_value;
            //console.log(pagesData[pageNum+1]);
            // also reattach the event handler
            applyValueChangeToSlider(pageNum, i+1);
        }
    } // end if backgroundLocationTaskSwitch is true
    
    if (characterFeaturesTaskSwitch == true) {
        
        // get the original emotion value per section
        for (var p=0; p<pagesData[pageNum].panels.length; p++) {
            for (var c=0; c<pagesData[pageNum].panels[p].characters.length; c++) {
                var getEmotionInput = document.getElementById("charEmotionSelect" + (p+1) + "." + c);
                var emotionValue = pagesData[pageNum].panels[p].characters[c].emotion;
                
                getEmotionInput.value = emotionValue;
            }
        }
        
        var canvases = document.getElementsByTagName('canvas'); // get all canvases

        var numCanvases = canvases.length; // get the total number of canvases
        //console.log("num canvases: " + numCanvases);

        // for each canvas
        for (var i=0; i<numCanvases; i++) {
            // if the canvas is one of the charBodyImages and not the comic page
            if (canvases[i].id.includes("canvas_charBodyImage")) {
                canvases[i].getContext('2d').drawImage(charBodyMapImage, 0, 0, 125, 300); // add the image to each canvas
                var canvasNum = canvases[i].id.replace("canvas_charBodyImage", "");
                //console.log("canvasNum: " + canvasNum);
                var panelNum = parseInt(canvasNum.split(".")[1]-1);
                //console.log("panelNum: " + panelNum);
                var charFigureNum = parseInt(canvasNum.split(".")[2]);
                drawSelectedAreasOnCharBodyImage(canvases[i], panelNum, charFigureNum);
                // add mouse click event listener to each canvas
                canvases[i].addEventListener('mousedown', function(e) {handleMouseClick(e)});
            }
            if (canvases[i].id.includes("canvas_charOrientation")) {
                context_of_charOrientation = canvases[i].getContext('2d');
                // put in the white background
                context_of_charOrientation.fillStyle = "white";
                context_of_charOrientation.fillRect(0, 0, canvas.width, canvas.height);
                context_of_charOrientation.restore();
                // put the purple circle
                context_of_charOrientation.beginPath();
                context_of_charOrientation.arc(cx, cy, 80, 0, 2 * Math.PI, false);
                context_of_charOrientation.fillStyle = '#7E06DA';
                context_of_charOrientation.fill();
                context_of_charOrientation.restore();
                // put the little rectangle
                context_of_charOrientation.beginPath();
                context_of_charOrientation.rect(80, 190, 40, 40);
                context_of_charOrientation.fillStyle = '#7E06DA';
                context_of_charOrientation.fill();
                context_of_charOrientation.restore();
                
                drawOrientationImage(canvases[i].id); // draw the kendon image
                
                // add event listeners
                canvases[i].addEventListener('mousedown', function(e) {rotateImage.handleMouseDown(e)});
                canvases[i].addEventListener('mousemove', function(e) {rotateImage.handleMouseMove(e)});
                canvases[i].addEventListener('mouseup', function(e) {rotateImage.handleMouseUp(e)});
                canvases[i].addEventListener('mouseout', function(e) {rotateImage.handleMouseOut(e)});
            }
        }
    }
} // end of putPreviousPageOnCanvas(event)




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
    
    // If on the Page Segmentation Task, then there is no need to validate inputs
    if (pageSegmentationTaskSwitch == true) {
        return errorMessage = "" // return the function
    }
    
    if (characterFeaturesTaskSwitch == true) {
    
        // i = panel number
        // j = char index number
        
            for (var i=0; i<pagesData[pageNum].panels.length; i++) {
                var panel = pagesData[pageNum].panels[i];
                //console.log(panel); //test
                for (var j=0; j<panel.characters.length; j++) {
                    // whatever is in the input box for the label, make that the character label
                    //console.log("i = " + i + " j = " + j);
                    
                    // Char Checks:
                    
                    // Char reference label
                    panel.characters[j].label = document.getElementById("charFeaturesFormInput" + (i+1) + "." + j).value;
                    var character = panel.characters[j];
                    
                    if (character.label == "" || character.label == charLabelInstruction) {
                        errorMessage += "Missing Character Label for Section " + (i + 1) + " Character Number " + (j + 1) + "\n"; // send message
                        document.getElementById("charFeaturesFormInput" + (i+1) + "." + j).style.backgroundColor = "LightPink"; // highlight input
                    } // end of char ref label
                    
                    // Char description checkbox and input
                    var descriptionChecked = document.getElementById("charDescriptionButton" + (i+1) +  "." + j).checked;
                    //console.log(descriptionChecked); // debug
                    
                    // Change in description/category
                    if (descriptionChecked == true) {
                        //console.log(panel.characters[j]);
                        //console.log(panel.characters[j].Description);
                        panel.characters[j].Description = document.getElementById("charDescriptionTextInput" + (i+1) +  "." + j).value;
                        if (panel.characters[j].Description == "" || panel.characters[j].Description == charDescriptionInstruction) {
                            errorMessage += "Missing Character Description for Section " + (i + 1) + " Character Number " + (j + 1) + "\n";
                            document.getElementById("charDescriptionTextInput" + (i+1) +  "." + j).style.backgroundColor = "LightPink";
                        }
                    } // end of description check input
                    
                    // Char emotion input check
                    panel.characters[j].emotion = document.getElementById("charEmotionSelect" + (i+1) +  "." + j).value;
                    //console.log(panel.characters[j].emotion);
                    
                    if (panel.characters[j].emotion == "Select an Emotion" || panel.characters[j].emotion == "") {
                        errorMessage += "Missing Emotion Selection for Section "  + (i + 1) + " Character Number " + (j + 1) + "\n";
                        document.getElementById("charEmotionSelect" + (i+1) +  "." + j).style.color = "red";
                    }
                    
                    //console.log("after validate input");
                    //console.log(panel.characters[j]);
                    
                    // Char Body Map image
                    var charBodyMapImageSections = panel.characters[j].areasShown;
                    //console.log(charBodyMapImageSections);
                    var allAreaValues = [];
                    allAreaValues.push(charBodyMapImageSections.armEast);
                    allAreaValues.push(charBodyMapImageSections.armWest);
                    allAreaValues.push(charBodyMapImageSections.footEast);
                    allAreaValues.push(charBodyMapImageSections.footWest);
                    allAreaValues.push(charBodyMapImageSections.handEast);
                    allAreaValues.push(charBodyMapImageSections.handWest);
                    allAreaValues.push(charBodyMapImageSections.head);
                    allAreaValues.push(charBodyMapImageSections.legEast);
                    allAreaValues.push(charBodyMapImageSections.legWest);
                    allAreaValues.push(charBodyMapImageSections.lowerBody);
                    allAreaValues.push(charBodyMapImageSections.shouldersEast);
                    allAreaValues.push(charBodyMapImageSections.shouldersWest);
                    allAreaValues.push(charBodyMapImageSections.upperBody);
                    
                    //console.log(allAreaValues);
                    
                    var atLeastOneAreaTrue = false;
                    
                    for (var a=0; a<allAreaValues.length; a++) {
                        if (allAreaValues[a] == true) {
                            atLeastOneAreaTrue = true;
                        }
                    }
                    if (atLeastOneAreaTrue == false) {
                        errorMessage += "Missing Areas Depicted for Section " + (i + 1) + " Character Number " + (j + 1) + "\n";
                        // get the correct canvas and highlihgt its border
                        var canvasCorrect = document.getElementById("canvas_charBodyImage" + pageNum + "." + (i+1) + "." + j);
                        canvasCorrect.style.border = '3px solid red';
                    }
                    
                    // Char orientation
                    // get the radius variable for each canvas
                    var orientationCanvasId = "canvas_charOrientation" + pageNum + "." + (i+1) + "." + j;
                    var charOrientationRadians = vars_charOrientation[orientationCanvasId].r;
                    //console.log(charOrientationRadians);
                    var pi = Math.PI;
                    var charOrientationDegrees = charOrientationRadians * (180/pi);
                    //console.log(charOrientationDegrees);
                    
                    panel.characters[j].orientationAngle = {
                        "radians" : charOrientationRadians,
                        "degrees" : charOrientationDegrees
                    }
                    
                    //console.log(panel.characters[j]);
                    
                    // create variables for each char orientation form created
                    vars_charOrientation[charOrientation_canvasid] = {
                        isDown : false,
                        r : charOrientationRadians
                    };
                    //"canvas_charOrientation" + pageNum + "." + y + "." + x;
                    
                    // Color and Style - must have at least one selected
                    panel.characters[j].multicolor = document.getElementById("charFullColorButton" + (i+1) + "." + j).checked;
                    panel.characters[j].blackandwhite = document.getElementById("blackAndWhiteButton" + (i+1) + "." + j).checked;
                    panel.characters[j].onecolororgradient = document.getElementById("charOneColorButton" + (i+1) + "." + j).checked;
                    panel.characters[j].shadowsilhouette = document.getElementById("charSilhouetteButton" + (i+1) + "." + j).checked;
                    
                    var characterFeatures = panel.characters[j];
                    
                    if (characterFeatures.multicolor == false && characterFeatures.blackandwhite == false && characterFeatures.onecolororgradient == false && characterFeatures.shadowsilhouette == false ) {
                        
                        errorMessage += "Select at Least One Checkbox in the Color and Style Section for Section  " + (i + 1) + " Character Number " + (j + 1) + "\n";
                        
                        var getMulticolorLabel = document.getElementById("charFullColorLabel" + (i+1) + "." + j);
                        getMulticolorLabel.style.color = "red";
                        var getBlackAndWhiteLabel = document.getElementById("blackAndWhiteButtonLabel" + (i+1) + "." + j);
                        getBlackAndWhiteLabel.style.color = "red";
                        var getOneColorLabel = document.getElementById("charOneColorButtonLabel" + (i+1) + "." + j);
                        getOneColorLabel.style.color = "red";
                        var getShadowLabel = document.getElementById("charSilhouetteButtonLabel" + (i+1) + "." + j);
                        getShadowLabel.style.color = "red";
                        
                    }
                    
                    // Char Non-detailed to Full Detail scale
                    var allDetailScaleValues =[];
                    
                    var detailedScaleValue1 = document.getElementById("liValue1" + (i+1) +  "." + j).checked;
                    var detailedScaleValue2 = document.getElementById("liValue2" + (i+1) +  "." + j).checked;
                    var detailedScaleValue3 = document.getElementById("liValue3" + (i+1) +  "." + j).checked;
                    var detailedScaleValue4 = document.getElementById("liValue4" + (i+1) +  "." + j).checked;
                    var detailedScaleValue5 = document.getElementById("liValue5" + (i+1) +  "." + j).checked;
                    
                    allDetailScaleValues.push(detailedScaleValue1);
                    allDetailScaleValues.push(detailedScaleValue2);
                    allDetailScaleValues.push(detailedScaleValue3);
                    allDetailScaleValues.push(detailedScaleValue4);
                    allDetailScaleValues.push(detailedScaleValue5);
                    
                    var atLeastOneRadioButtonTrue = false;
                    
                    for (var b=0; b<allDetailScaleValues.length; b++) {
                        if (allDetailScaleValues[b] == true) {
                            atLeastOneRadioButtonTrue = true;
                            panel.characters[j].detail = b+1;
                        }
                    }
                    if (atLeastOneRadioButtonTrue == false) {
                        errorMessage += "Missing Detail Value for Section " + (i + 1) + " Character Number " + (j + 1) + "\n";
                        var imageDetailScaleRetrieved = document.getElementById("ulImageDetailScale" + (i+1) +  "." + j);
                        imageDetailScaleRetrieved.style.color = "red";
                        var radioInput1Label = document.getElementById("li1Label" + (i+1) +  "." + j);
                        radioInput1Label.style.color = "red";
                        var radioInput2Label = document.getElementById("li2Label" + (i+1) +  "." + j);
                        radioInput2Label.style.color = "red";
                        var radioInput3Label = document.getElementById("li3Label" + (i+1) +  "." + j);
                        radioInput3Label.style.color = "red";
                        var radioInput4Label = document.getElementById("li4Label" + (i+1) +  "." + j);
                        radioInput4Label.style.color = "red";
                        var radioInput5Label = document.getElementById("li5Label" + (i+1) +  "." + j);
                        radioInput5Label.style.color = "red";
                    }
                    //console.log(panel.characters[j]);
                } // for j char index loop
            } // for i panel index loop
        
    } // end of character annotation task vadilate input check
    
    if (textSectionsTaskSwitch == true) {
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var panel = pagesData[pageNum].panels[i];
        
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
        }
    } // end of text section annotation task validate input check

    if (backgroundLocationTaskSwitch == true) {
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var panel = pagesData[pageNum].panels[i];
            //console.log(panel);
            var panel_background = panel["background"];
            
            var slider_output_bubble = document.getElementById("slider_output" + pageNum + "." + (i+1)).value;
            //console.log(slider_output_bubble); // debugggg
            
            if (slider_output_bubble == "background information amount") {
                errorMessage = errorMessage + "Missing a value for Section " + (i+1) + "\n"; // send message
            }
            else {
                var slider_item = document.getElementById("slider" + pageNum + "." + (i+1));
                var detail_value = slider_item.value;
                
                panel_background["detail"] = detail_value;
            }
        }
        console.log(pagesData);
    } // end of backgroundLocationTaskSwitch == true validate input check
    
    
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
    drawCharacterInfoOnCanvas(true);
    drawTextSectionInfoOnCanvas();
    console.log("Validate Forms" + errorMessage);
    errorFound = false;
    return errorMessage;
} // end of validateInputs()






/* PAGE SEGMENTATION - DRAWING PANEL/SECTION RECTS on a COMIC IMAGE */

/* Drawing Bounding Box Rectangles on Comic Image for panels
 code reference: https://stackoverflow.com/questions/48144924/draw-multiple-rectangle-on-canvas
 */

/* Drawing multi-point polygons on a comic image for panels
 code reference:
 http://jsfiddle.net/77vg88mc/34/
 https://stackoverflow.com/questions/29441389/how-to-draw-polygon-on-canvas-with-mouse-clicks-pure-js
 */

// Get correct X and Y Coords
var recOffsetX, recOffsetY;

function reOffset() {
    canvas = document.getElementById("canvas");
    var BB = canvas.getBoundingClientRect();
    recOffsetX = BB.left;
    recOffsetY = BB.top;
}

// function that draws polygon while drawing
function drawPolygonWhileDrawing(coordsList) {
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("Draw function pageNum: " + pageNum); //test
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw image on canvas
    context.lineWidth = 3;
    context.strokeStyle = "#FF0000";
    // if this is not the first polygon panel created, draw all other polygons
    if (pagesData[pageNum].panels.length != 0) {
        drawPolygonsOnCanvas.drawAllPolygons(); // draw all polygons stored so far
    }
    context.beginPath();
    context.moveTo(coordsList[0].x, coordsList[0].y);
    for(index=1; index<coordsList.length;index++) {
        context.lineTo(coordsList[index].x, coordsList[index].y);
    }
    context.closePath();
    context.stroke();
    
} // end of function drawPolygonWhileDrawing()


var individualPolygonCoordinates = []; // store polygon coords


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

    var boundingBoxSegmentation = true;
    
    // Bounding Box Event Listeners:
    if (boundingBoxSegmentation) {
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
        console.log("addCanvasEvents: Bounding Box Panel ID event handers added");
    } // end of boundingBoxSegmentation event handlers

    var polygonSegmentation = false;
    
    // Polygon Event Listenters:
    if (polygonSegmentation) {
    canvas.addEventListener("mousedown", function(e) {
                            drawPolygonsOnCanvas.handleMouseDown(e);
                            }, false);
    canvas.addEventListener("dblclick", function(e) {
                            drawPolygonsOnCanvas.handleMouseDoubleClick();
                            }, false);
//    document.addEventListener("keydown", function(e) {
//                            drawPolygonsOnCanvas.deleteKey(e);
//                            }, false);
    console.log("addCanvasEvents: Polygon Panel ID event handers added");
    }// end of polygonSegmentation event handlers
    
} // end of function addCanvasEvents()


var drawPolygonsOnCanvas = {
    
    handleMouseDown: function(e) {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // var mousePos = getMousePos(canvas, e);
        // console.log(mousePos.x + ", " + mousePos.y); //test
        coordX = parseInt(e.clientX - recOffsetX);
        coordY = parseInt(e.clientY - recOffsetY);
        individualPolygonCoordinates.push({x:coordX,y:coordY});
        //console.log(individualPolygonCoordinates); // check
        drawPolygonWhileDrawing(individualPolygonCoordinates);
    },
    
    handleMouseDoubleClick: function(e) {
        console.log("double click!"); // test
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        // tell the browser we're handling this event
        //e.preventDefault();
        //e.stopPropagation();
        
        // create a new panel data object
        newPanel = {
            polygonCoords: individualPolygonCoordinates,
            color: "#FF0000",
            id : pagesData[pageNum].panels.length + 1,
            characters:[],
            textSections: [],
            background: {location : "",
                         detail : 0,
                         textOnly: 0
                        }
        }
        
        pagesData[pageNum].panels.push(newPanel); // Store created panels in the overall data structure
        individualPolygonCoordinates = []; // reset the current polygon coords
        //console.log(individualPolygonCoordinates); // check
        drawPolygonsOnCanvas.drawAllPolygons(); // draw all polygons stored so far
    },
    
    deleteKey: function(e) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        console.log("a key pressed.");
        const key = e.key;
        if (key === "Backspace" || e.keyCode === 46) {
            console.log("Delete key pressed.");
        }
    },
    
    drawPolygon: function(coordsList) {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        
        context.lineWidth = 3;
        context.strokeStyle = "#FF0000";
        
        context.beginPath();
        context.moveTo(coordsList[0].x, coordsList[0].y);
        for(index=1; index<coordsList.length;index++) {
            context.lineTo(coordsList[index].x, coordsList[index].y);
        }
        context.closePath();
        context.stroke();
    },
    
    drawAllPolygons: function() {
        //console.log("drawAllPolygons"); // debugggs
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("Draw function pageNum: " + pageNum); //test
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(comicPages[pageNum],canvas.width/2 - comicPages[pageNum].width/2, canvas.height/2-comicPages[pageNum].height/2,  comicPages[pageNum].width, comicPages[pageNum].height); // Draw image on canvas
        context.lineWidth = 3;
        context.strokeStyle = "#FF0000";
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var panel = pagesData[pageNum].panels[i]; // Get all stored panel rects
            var polyCoords = panel.polygonCoords;
            var firstXCoord = polyCoords[0].x;
            var firstYCoord = polyCoords[0].y;
            drawPolygonsOnCanvas.drawPolygon(polyCoords);
            context.beginPath(); // draw circle
            context.arc(firstXCoord-5, firstYCoord-5, 15, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = panel.color;
            context.fill();
            context.beginPath(); // draw number in circle
            context.fillStyle = "white";
            context.font = "15px Arial Black";
            context.fillText(panel.id, firstXCoord-10, firstYCoord); // center into the circle
        }
    }
} // end of drawPolygonsOnCanvas object



// Draw Bounding Boxes:
// Object that contains event listeners to draw rectangles onto the canvas element
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
} // end of drawRectangleOnCanvas object



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
    
    // change button text to white to indicate that the task event handlers are off
    document.getElementById("startButton").style.color = "white";
    
    // For page segmentation, do not show the content forms or the panelNumSection
    if (pageSegmentationTaskSwitch == true) {
        //document.getElementById("panelNumSection").style.display = "block"; // do not display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        //showContentForms(panelRecNum-1); // do not show content forms
    }
    // Only create buttons at the bottom page when this function runs for the first page
    if (document.getElementById("startAnnotationButton").innerHTML == "Page 1 of " + comicPages.length && !navigationButtonsCreated) {
        // if the story only has one page, setup the submit annotation buttons here
        if (comicPages.length == 1) {
            createNavigationButtons();
            navigationButtonsCreated = true;
            buttonChange = document.getElementById("buttonNextPage");
            buttonChange.innerHTML = "Last Page: Submit All Annotations";
            buttonChange.setAttribute("onclick", "submitSemanticForms(event)");
        }
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
    
    // If Page Segmentation Task, do not turn on and show the panelNumSection
    if (pageSegmentationTaskSwitch == true) {
        //document.getElementById("panelNumSection").style.display = "inline-block";
    }
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


/* GENERATE SEMANTIC FORM - Create and Show (parts of) the form sections that need to be filled in - the number of forms that apper should be the number of panels indicated by the user */
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
        
        // If the Character Segmentation task is selected, show the indicate character buttons on the forms
        
        if (characterSegmentationTaskSwitch == true) {
        
            // Characters: Heading and buttons container
            var newCharHeading = document.createElement("h4"); // Characters heading
            newCharHeading.id = "newCharHeading" + j;
            newCharHeading.innerHTML = "Characters";
            clone.insertBefore(newCharHeading, newHeading.nextSibling);
            
            var indicateCharButton = document.createElement("BUTTON"); // start char ID task button
            indicateCharButton.id = "indicateCharButton" + j;
            indicateCharButton.innerHTML = "Indicate Characters";
            indicateCharButton.setAttribute("onclick","startIndividualCharID(event)");
            clone.insertBefore(indicateCharButton, newCharHeading.nextSibling);
            // For the Indicate Characters button, only show it and make it available in the first section - this helps navigate the annotator to start char annotation for the first section
            //console.log("indicateCharButton id: " + indicateCharButton.id) //test
            if (j == 1) {
                indicateCharButton.style.display = "block";
            }
            else {
                indicateCharButton.style.display = "none";
            }
        } // end of if characterSegmentationTaskSwitch == true
        
        // If the Character Features task is selected, show the annotation tasks to be filled out per form
        
        if (characterFeaturesTaskSwitch == true) {
            
            // Show the character segmentation bounding boxes on the comic page
            drawCharacterInfoOnCanvas();
            // Show the character semantic forms with the annotation tasks:
            // get the number of characters in that segmentation
            var numCharsPerPanel = pagesData[pageNum].panels[j-1].characters.length; // note that the panel num j is incremented down one, to index the char array accurately
            //console.log("num chars per panel: " + numCharsPerPanel);
            
            // for each outlined character
            for (let k=0; k < numCharsPerPanel; k++) {
                // create a new char form
                var charFeaturesForm = createCharFeaturesForm(k, j);
                // put the char feautres form in the correct semantic form
                clone.appendChild(charFeaturesForm);
                //console.log("completely new charFeaturesForms created"); // debug
            }
        } // end of characterFeaturesTaskSwitch == true
        
        
        // If the Text Section task is selected, show the text sections tasks on the forms
        
        if (textSectionsTaskSwitch == true) {
        
            // Text: ID Bubbles and Blocks section
            var newTextSectionsHeading = document.createElement("h4"); // Text Sections heading
            newTextSectionsHeading.id = "newTextSectionsHeading" + j;
            newTextSectionsHeading.innerHTML = "Text Sections";
            clone.insertBefore(newTextSectionsHeading, newHeading.nextSibling);
            //newTextSectionsHeading.style.display = "none"; // hide until char ID task is done
            
            var indicateTextButton = document.createElement("BUTTON"); // start text ID task button
            indicateTextButton.id = "indicateTextButton" + j;
            indicateTextButton.innerHTML = "Indicate Text Boxes and Bubbles";
            indicateTextButton.setAttribute("onclick","startTextIDTask(event)");
            clone.insertBefore(indicateTextButton, newTextSectionsHeading.nextSibling);
            //indicateTextButton.style.display = "none"; // hide until char ID task is done
            
            // For the Indicate Text button, only show it and make it available in the first section - this helps navigate the annotator to start the text task in the first section
            if (j == 1) {
                indicateTextButton.style.display = "block";
            }
            else {
                indicateTextButton.style.display = "none";
            }
        } // end of textSectionsTaskSwitch == true
        
        // If the Background and Location task is selected, show the correct annotation tasks on the forms
        
        if (backgroundLocationTaskSwitch == true) {
            // Background: Label, Description, and Empty/Detailed
            var newBackgroundHeading = document.createElement("h4"); // Background heading
            newBackgroundHeading.id = "newBackgroundHeading" + j;
            newBackgroundHeading.innerHTML = "Background";
            newBackgroundHeading.style.visibility = "hidden"; // don't show the heading
            clone.insertBefore(newBackgroundHeading, newHeading.nextSibling);
            
            // Create an interactive slider
            // adapted from https://www.dottedsquirrel.com/range-slider-javascript/
            // and https://stackoverflow.com/questions/33699852/show-tick-positions-in-custom-range-input
            
            var slider_container = document.createElement('div'); // create slider container
            slider_container.id = "slider_container" + pageNum + "." + j;
            slider_container.setAttribute('class', "range");
            var slider_value = document.createElement('div'); // create slider value
            slider_value.id = "slider_value" + pageNum + "." + j;
            slider_value.setAttribute('class', "slider_value");
            var slider_value_span = document.createElement('span');
            slider_value_span.setAttribute('class', "slider_value_span"); 
            slider_value_span.id = "slider_value_span" + pageNum + "." + j;
            slider_value_span.innerHTML = 5;
            
            slider_value.appendChild(slider_value_span);
            
            var slider_field_container = document.createElement('div');
            slider_field_container.id = "slider_field" + pageNum + "." + j;
            slider_field_container.setAttribute('class', "field");
            var slider_value_left = document.createElement('div');
            slider_value_left.id = "slider_value_left" + pageNum + "." + j;
            slider_value_left.setAttribute('class', "value_left");
            slider_value_left.innerHTML = "No Background Information";
            var slider = document.createElement('input');
            slider.id = "slider" + pageNum + "." + j;
            
            // slider setup:
            slider.setAttribute('type', "range");
            slider.setAttribute('min', "1");
            slider.setAttribute('max', "5");
            slider.setAttribute('value', "3");
            slider.setAttribute('step', "2"); // "any" accepts a value regardless of how many decimal points, "1" creates the likert scale, "2" is used for the binary classification
            slider.setAttribute('list', "range_labels" + pageNum + "." + j);
            var slider_output = document.createElement('output');
            slider_output.id = "slider_output" + pageNum + "." + j;
            slider_output.setAttribute('class', "bubble");
            slider_output.innerHTML = "background information amount";
            var slider_value_right = document.createElement('div');
            slider_value_right.id = "slider_value_right" + pageNum + "." + j;
            slider_value_right.setAttribute('class', "value_right");
            slider_value_right.innerHTML = "Background Information"; // "Full Background Information"
            
            var slider_ticks_container = document.createElement('div');
            slider_ticks_container.id = "slider_ticks_container" + pageNum + "." + j;
            slider_ticks_container.setAttribute('class', "sliderticks");
            //var label_0 = document.createElement('p');
            //label_0.innerHTML = "0";
            var label_1 = document.createElement('p');
            label_1.innerHTML = "1";
            label_1.setAttribute('class', "endTicks");
            var label_2 = document.createElement('p');
            label_2.innerHTML = "2";
            label_2.setAttribute('class', "mainTicks");
            var label_3 = document.createElement('p');
            label_3.innerHTML = "3";
            label_3.setAttribute('class', "mainTicks");
            var label_4 = document.createElement('p');
            label_4.innerHTML = "4";
            label_4.setAttribute('class', "mainTicks"); 
            var label_5 = document.createElement('p');
            label_5.innerHTML = "5";
            label_5.setAttribute('class', "endTicks");

            slider_ticks_container.appendChild(label_1);
            slider_ticks_container.appendChild(label_2);
            slider_ticks_container.appendChild(label_3);
            slider_ticks_container.appendChild(label_4);
            slider_ticks_container.appendChild(label_5);
            
            slider_field_container.appendChild(slider_value_left);
            slider_field_container.appendChild(slider);
            slider_field_container.appendChild(slider_output);
            slider_field_container.appendChild(slider_value_right);
            
            slider_container.appendChild(slider_value);
            slider_container.appendChild(slider_field_container);
            //slider_container.appendChild(slider_ticks_container); // do not show the ticks when implementing the binary scale
            
            clone.insertBefore(slider_container, newBackgroundHeading.nextSibling);
            
            // Check if there is data already for detail on that page, if so that page has already been visited - put that data into the form sections
            //console.log(pagesData[pageNum]);
            var panels_selected = pagesData[pageNum].panels;
            var panel_selected = panels_selected[j-1];
            var panel_detail_value = panel_selected["background"]["detail"];
            //console.log(panel_detail_value);
            if (panel_detail_value != "") {
                slider.value = panel_detail_value;
                slider_output.innerHTML = parseFloat(panel_detail_value).toFixed(0);;
            }
            else {
                slider_output.innerHTML = "background information amount";
            }
            
        
        } // end of backgroundLocationTaskSwitch == true
        
        // Append the cloned semantic form to correct section
        document.getElementById("semanticFormContainer").appendChild(clone);
        //console.log(clone.id); //test
        
        applyValueChangeToSlider(pageNum, j); // add the eventHandlers to the sliders after they have been put on the page
    }
} // end of showContentForms(x) function


function applyValueChangeToSlider(pageNumber, x) {
    // x is the index of the span and slider
    var slider_span = document.getElementById("slider_value_span" + pageNumber + "." + x);
    var actual_slider = document.getElementById("slider" + pageNumber + "." + x);
    var output_bubble = document.getElementById("slider_output" + pageNumber + "." + x);
    //console.log(slider_span); // Debugginz
    //console.log(actual_slider);
    var min = actual_slider.min;
    var max = actual_slider.max;
    //console.log(min, max);
    var newVal;
    
    actual_slider.oninput = (() =>{
                           let value = actual_slider.value;
                           //slider_span.textContent = parseFloat(value).toFixed(0); // "0" when likert scale, "2" when real-valued scale
                           newVal = Number(((value - min) * 100) / (max - min));
                           //output_bubble.innerHTML = parseFloat(value).toFixed(0); // "0" when likert scale, "2" when real-valued scale
                             // for binary scale:
                             if (value == 1) {
                                output_bubble.innerHTML = "0";
                             }
                             if (value == 5) {
                                output_bubble.innerHTML = "1";
                             }
                             if (value == 3) {
                             output_bubble.innerHTML = "background information amount";
                             }
                           });
} // end of function applyValueChangeToSlider(x)

    


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
    buttonNextPage.setAttribute("id", "buttonNextPage");
    buttonNextPage.setAttribute("class","pageNavigationButtons");
    document.getElementById("semanticButtonsContainer").appendChild(buttonNextPage);
    // check if there is only one page in the story...
    if (pageNum == comicPages.length-1) {
        buttonNextPage.innerHTML = "Last Page: Submit All Annotations";
        buttonNextPage.setAttribute("onclick", "submitSemanticForms(event)");
    }
    else {
        buttonNextPage.innerHTML = "Next Page";
        buttonNextPage.setAttribute("onclick", "nextPage(event)");
    }
} // end of createNavigationButtons()




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
    
    charIdON = false;  // turn off all (panel ID, char ID, text ID) canvas ID tasks
    drawRectsON = false;
    textIdON = false;
    
    // Take the scroll off the semantic forms section
    if (scrollON) {
        scrollON = false;
        document.getElementById("semanticFormContainer").setAttribute("class","true");
    }
    
    putComicPageOnCanvas(); // Put next page on canvas
    
    // Add first panel task ID event listeners to the canvas
    //addCanvasEvents();
    
    //panelButtonsVisible = true;
    //document.getElementById("panelIdSection").style.display = "block";
    
    
    if (pageSegmentationTaskSwitch == true) {
        // Empty data stored, refresh page
        pagesData[pageNum] = {};
        pagesData[pageNum].panels = [];
        //console.log(pagesData); //test
        removeSemanticForms();
        pagesData[pageNum].storedSemanticFormContainer = document.getElementById("semanticFormContainer").cloneNode(true);
        
        // Setup panel ID button situation
        if (lastThreePanelIDButtonsVisible) {
            lastThreePanelIDButtonsVisible = false;
            document.getElementById("clearLastRectButton").style.display = "none";
            document.getElementById("clearButton").style.display = "none";
            document.getElementById("endButton").style.display = "none";
        }
    }
    
    // get the number of page segmentation sections on the page
    var numPageSegmentationsOnPage = pagesData[pageNum].panels.length;
    console.log("number of page segmentations: " + numPageSegmentationsOnPage);
    
    
    // if the Character Segmentation task is on, allow for removing character bounding boxes and character semantic forms
    if (characterSegmentationTaskSwitch == true) {
        // empty stored character data
        for (var i=0; i < numPageSegmentationsOnPage; i++) {
            pagesData[pageNum].panels[i].characters = []; // remove char data for each page
        }
        removeSemanticForms(); // remove all the semantic forms
        // display the semantic forms:
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
        drawPanelInfoOnCanvas(); // make sure the page sections are on the comic page
    }
    
    if (textSectionsTaskSwitch == true) {
        // empty stored text section data
        for (var i=0; i < numPageSegmentationsOnPage; i++) {
            pagesData[pageNum].panels[i].textSections = []; // remove text section data for each page
        }
        removeSemanticForms(); // remove all the semantic forms
        // display the semantic forms:
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
        drawPanelInfoOnCanvas(); // make sure the page sections are on the comic page
    }
    
    if (characterFeaturesTaskSwitch == true) {
        // put scroll back on the semantic form task
        if (scrollON == false) {
            scrollON = true;
            document.getElementById("semanticFormContainer").setAttribute("class","semanticFormContainerScroll");
        }
        // show panel rects and char rects on the comic page
        drawPanelInfoOnCanvas();
        drawCharacterInfoOnCanvas();
        removeSemanticForms();
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        showContentForms(panelRecNum-1); // show content forms
    } // end of if characterFeaturesTaskSwitch
    
    if (backgroundLocationTaskSwitch == true) {
        // put scroll back on the semantic form task
        if (scrollON == false) {
            scrollON = true;
            document.getElementById("semanticFormContainer").setAttribute("class","semanticFormContainerScroll");
        }
        drawPanelInfoOnCanvas();
        removeSemanticForms();
        document.getElementById("panelNumSection").style.display = "block"; // display the panelNumSection
        panelRecNum = pagesData[pageNum].panels.length + 1;
        panelCounter(panelRecNum-1); // turn off the panel counter function
        
        // clear the data in pagesData
        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
            var panel_here = pagesData[pageNum].panels[i];
            var panel_here_background = panel_here["background"];
            panel_here_background["detail"] = "";
        }
        showContentForms(panelRecNum-1); // show content forms
//        for (var i=0; i<pagesData[pageNum].panels.length; i++) {
//            var range_bubble = document.getElementById("slider_output" + pageNum + "." + i+1);
//            range_bubble.value = "3";
//        }
    } // end of if backgroundLocationTaskSwitch
    
    //console.log(pagesData);
    console.log("Page Reset");
} // end of resetPage(event)




/* Function to submit semantic forms */
function submitSemanticForms(event) {
    //event = click
    // Check how the data is being stored in the console
    for (var i=0; i < pagesData.length; i++) {
        for (var j=0; j < pagesData[i].panels.length; j++ ) {
            //console.log(pagesData[i].panels[j]);
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

//    if (storyNum == 32) {
//        window.location.href = "check.html";
//    }
//    else {
//        // Lastly, go to the last webpage
//        window.location.href = "endPage.html";
//    }
} // end of submitSemanticForms(event)



// Submit annotated data to firebase database
function sendDataToFireBase(event) {
    //convert pagesData to a JSON file
    event.preventDefault();
    var finalData = {'pagesData' : pagesData,
        'storyID': storyNum,
        'participantNum': participantNum,
        'annotationLastCompleted': annotationTaskCompleted,
        'URL' : URL
    };
    var jsonString = JSON.stringify(finalData);
    console.log(jsonString); //test
    // use fs from Node.js to write the file to disk
    //var fs = require('fs');
    //fs.writeFile('jsonFile.json', jsonFile, 'utf8', callback);
    //db.collection("Test").add({
    //                          jsonString: jsonString
    //                          });
    
    db.collection("Background_Experiment6").add({time: Date().toLocaleString(),
                              jsonData: jsonString}
                              ).then(function(snapshot) {
                                if (storyNum == 32) {
                                     window.location.href = "check.html";
                                }
                                else {
                                     // Lastly, go to the last webpage
                                     window.location.href = "endPage.html";
                                }
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
} // end function sendDataToFireBase(event)








/* ANNOTATION and DATA SUBMISSION within SEMANTIC FORMS - Interaction and data inputs
        for CHAR and TEXT Annotation Tasks */

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
} // end of startIndividualCharID(event)



/* Initiliaze and Start Text Bubble/Blocks Task */
function startTextIDTask(event) {
    
    //console.log("HERE!");
    
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
} // end of startTextIDTask(event)


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
} // end of activateCharIDTask(event)



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
} // end of activateTextIDTask(event)



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



/* Remove the last created char form and the associated rectangle */
function removeLastCharFormButton(event) {
    //event = mouse click
    
    // Remove the last created char input form
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    console.log("removeLastCharFrom Button clicked"); //test
    console.log("currentPanel: " + currentPanelNumber); //test
    var lastCharIndex = pagesData[pageNum].panels[currentPanelNumber].characters.length-1;
    
    
    // Remove the last char form button:
    
    // The old method...
    // remove the last char form, which is the sibling previous to the newTextSection heading
    //var newTextSectionsHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber+1));
    //console.log("checking new text section " + (currentPanelNumber+1) + " is there?");
    //console.log(newTextSectionsHeading);
    
    //currentPanel.removeChild(newTextSectionsHeading.previousSibling.previousSibling);
    
    // The new method is to delete the sibling above the End Task Button
    
    var numChildrenOnCurrentPanel = currentPanel.children.length; // get number of children on the panel section
    console.log("number of children on current panel: " + currentPanel.children.length);
    
    // Check that a new character form element has been added. If so...
    if (numChildrenOnCurrentPanel > 5) {
        // Remove the character form element
        currentPanel.removeChild(currentPanel.children[numChildrenOnCurrentPanel-2]);
        // Remove last entry in panels[currentPanelNumber].characters
        pagesData[pageNum].panels[currentPanelNumber].characters.pop();
        //console.log(pagesData[pageNum].panels[currentPanelNumber].characters); //test
    } else {
        // If not, do nothing.
    }
    
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
} // end of function removeLastCharFormButton(event)



/* Remove the last created text section form and associated rectangle */
function removeLastTextForm(event) {
    
    var currentPanel = event.target.parentNode; // Get the panel where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("removeLastTextFrom Button clicked"); //test
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    //var removeLastTextButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log("button ID: " + removeLastTextButtonID); //test
    
    var lastTextIndex = pagesData[pageNum].panels[currentPanelNumber].textSections.length-1;
    
    // Remove the text section form:
    // old method - remove the last text section form, which is the sibling previous to the newBackground heading
    //var newBackGroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber+1));
    
    //currentPanel.removeChild(newBackGroundHeading.previousSibling.previousSibling);
    
    // new method
    var numChildrenOnCurrentPanel = currentPanel.children.length; // get number of children on the panel section
    console.log("number of children on current panel: " + currentPanel.children.length);
    
    // Check that a new character form element has been added. If so...
    if (numChildrenOnCurrentPanel > 5) {
        // Remove the character form element
        currentPanel.removeChild(currentPanel.children[numChildrenOnCurrentPanel-2]);
        // Remove last entry in panels[currentPanelNumber].characters
        pagesData[pageNum].panels[currentPanelNumber].textSections.pop();
        //console.log(pagesData[pageNum].panels[currentPanelNumber].characters); //test
    } else {
        // If not, do nothing.
    }
    
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
} // end of removeLastTextForm(event)






/* Original Char Form Funciton! */
/* Function to Create a Full Char form after a new char rectangle has been created */
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
    charForm.setAttribute("class", "charNumIndexForm"); // set class to the charNumIndexForm
    
    // Put the number of the char just outlined in that section on the form
    var charNumIndicator = document.createElement("p");
    var newCharIndexString = (newCharIndex + 1).toString();
    var charNumTextNode = document.createTextNode(newCharIndexString);
    charNumIndicator.appendChild(charNumTextNode);
    
    charForm.appendChild(charNumIndicator); // Add the char index number to the charForm
    // Put the char form between the "remove last character" button and "end task for this section" button
    var endCharIDTaskButton = document.getElementById("endCharIDTaskButton" + currentPanelNumber);
    //console.log(endCharIDTaskButton); //test
    //var newTextSectionHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber + 1));
    document.getElementById(currentPanel.getAttribute('id')).insertBefore(charForm, endCharIDTaskButton);
} // end of function createCharForm()



/* Puts the Char label on the canvas - goes with event handler for the Character Label text input on the charFeaturesForm */
function placeCharLabelOnCanvas() {
    //e.preventDefault(); // tell the browser we're handling this event
    var charTextInputID = event.target.getAttribute("id"); // get the input id
    //console.log("it me!! " + charTextInputID); //test
    currentPanel = event.target.parentNode.parentNode.parentNode; // Get the panel form where the button was clicked
    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
    //console.log("currentPanel: " + currentPanelNumber); //test
    
    var inputValue = event.target.value;
    //console.log(inputValue); //test
    
    var currentCharacterID = event.target.getAttribute('id').replace("charFormInput", "");
    // Store inputValue into tha right char structure's label field
    var currentCharacterNum = (parseInt(currentCharacterID.split(".")[1]));
    //console.log(currentCharacterID.split("."));
    //console.log("current character number: " + currentCharacterNum);
    pagesData[pageNum].panels[currentPanelNumber].characters[currentCharacterNum].label = inputValue; // put the label in pagesData
    
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
    context.fillText(inputValue, xcoord-6, ycoord+6);
    
    // change the input to white just in case the background has been highlighted after validation
    document.getElementById(charTextInputID).style.backgroundColor = "white";
    
} // end function placeCharLabelOnCanvas()



/* Function to get an inputted value and store it on a list */
// adapted from: https://schier.co/blog/wait-for-user-to-stop-typing-using-javascript
function getInputValue_NoKeyPressedForOneSec(e) {
    
//    var charTextInputID = event.target.getAttribute("id"); // get the input id
//    //console.log("it me!! " + charTextInputID); //test
//    currentPanel = event.target.parentNode.parentNode; // Get the panel form where the button was clicked
//    var currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1; // Get the number of that panel
//    console.log("currentPanel: " + currentPanelNumber); //test
//
    var labelOnList = false; // init a boolean to track whether the inputted label has already been inputted
    
    var inputValue = event.target.value; // get value from the text input
    //console.log(inputValue); //test
    
    clearTimeout(timeout); // clear the timeout variable
    
    // Make a new timeout set to go off in 3000ms (3 seconds)
    timeout = setTimeout(function () {
                            //console.log('Input Value:', inputValue); // deboog
                            if (charList.length == 0) {
                                charList.push(inputValue);
                            }
                            else {
                                for (var c=0; c<charList.length; c++) {
                                    if (charList[c] == inputValue) {
                                        labelOnList = true;
                                    }
                                }
                                if (labelOnList == false) {
                                    charList.push(inputValue);
                                }
                            }
                          updateDatalists();
                         }, 3000);
    
    //console.log(charList); // Debuggins
    
} // end of getInputValue_NoKeyPressedForOneSec()



function updateDatalists() {
    
    // first, clear all the options on all the datalists
    var totalPanelsOnPage = pagesData[pageNum].panels.length;
    
    for (var m=0; m<totalPanelsOnPage; m++) {
        var totalCharsOnPanel = pagesData[pageNum].panels[m].characters.length;
        for (var n=0; n<totalCharsOnPanel; n++) {
            var charlabelTextInput_datalist = document.getElementById("datalist" + (m+1) +  "." + n);
            var dataListOptionsLength = charlabelTextInput_datalist.childNodes.length-1;
                //console.log(dataListOptionsLength);
            for (var b=dataListOptionsLength; b>=0; b--) {
                //console.log(charlabelTextInput_datalist); // debugz
                while (charlabelTextInput_datalist.lastElementChild) {
                    charlabelTextInput_datalist.removeChild(charlabelTextInput_datalist.lastElementChild);
                }
            }
        }
    }
    
    // now put each element from the charList as an option on the datalists
    
    for (var m=0; m<totalPanelsOnPage; m++) {
        var totalCharsOnPanel = pagesData[pageNum].panels[m].characters.length;
        for (var n=0; n<totalCharsOnPanel; n++) {
            var charlabelTextInput_datalist = document.getElementById("datalist" + (m+1) +  "." + n);
            for (var a=0; a<charList.length; a++) {
                var option = document.createElement('option');
                option.setAttribute('id', "option" + (m+1) + "." + n + "." + a);
                option.value = charList[a];
                //nsole.log(charlabelTextInput_datalist);
                charlabelTextInput_datalist.appendChild(option);
            }
        }
    }
} // end of updateDatalists()




/* Character Body Image - Clickable Canvas */

// Get correct X and Y Coords for the charBodyImage Canvas
var recOffsetX_charBodyImage, recOffsetY_charBodyImage; // Declare coords variables

// function to get the correct coords relative to the canvas
function reOffset_charBodyImage(canvasA) {
    var BB_charBodyImage = canvasA.getBoundingClientRect();
    recOffsetX_charBodyImage = BB_charBodyImage.left;
    recOffsetY_charBodyImage = BB_charBodyImage.top;
}


// Create Clickable Areas (name and coords) for the charBodyImage canvases
var head = {
    name: "head",
    points:[{x:57,y:43},{x:49,y:33}, {x:49,y:14}, {x:57,y:5}, {x:71,y:5}, {x:78,y:14}, {x:79,y:33}, {x:72,y:42}, {x:57,y:43}]
}

var shouldersWest = {
    name: "shouldersWest",
points:[{x:57,y:44}, {x:47,y:52}, {x:34,y:54}, {x:27, y:63}, {x:27,y:70}, {x:63,y:71}, {x:63,y:43}, {x:72,y:43}, {x:57,y:44}]
}

var shouldersEast = {
    name: "shouldersEast",
points:[{x:63,y:43}, {x:63,y:71}, {x:99,y:71}, {x:99,y:61}, {x:92,y:54}, {x:77,y:49}, {x:72,y:43}, {x:63,y:43}]
}

var upperBody = {
    name: "upperBody",
    points:[{x:40,y:70}, {x:41,y:90}, {x:43,y:105}, {x:42,y:119}, {x:85,y:119}, {x:85,y:105}, {x:87,y:89}, {x:85,y:70}, {x:40,y:70}]
}

var armWest = {
    name: "armWest",
points:[{x:27,y:71}, {x:27,y:102}, {x:20,y:116}, {x:18,y:146}, {x:26,y:149}, {x:26,y:139}, {x:36,y:121}, {x:39,y:89}, {x:40,y:71}, {x:27,y:71}]
}

var handWest = {
    name: "handWest",
    points:[{x:18,y:147}, {x:11,y:154}, {x:6,y:163}, {x:8,y:175}, {x:19,y:176}, {x:26,y:169}, {x:26,y:149}, {x:18,y:147}]
}

var armEast = {
    name: "armEast",
    points:[{x:85,y:70}, {x:99,y:72}, {x:102,y:105}, {x:107,y:120}, {x:108,y:139}, {x:111,y:149}, {x:103,y:151}, {x:91,y:125}, {x:91,y:105}, {x:88,y:90}]
}

var handEast = {
    name: "handEast",
    points:[{x:102,y:151}, {x:112,y:150}, {x:118,y:155}, {x:122,y:165}, {x:120,y:174}, {x:107,y:178}, {x:101,y:169}, {x:102,y:151}]
}

var lowerBody = {
    name: "lowerBody",
    points:[{x:42,y:120}, {x:86,y:120}, {x:92,y:143}, {x:90,y:175}, {x:85,y:210}, {x:70,y:216}, {x:68,y:201}, {x:68,y:181}, {x:63,y:148}, {x:60,y:184}, {x:59,y:201}, {x:55,y:215}, {x:41,y:212}, {x:36,y:175}, {x:35,y:140}, {x:42,y:120}]
}

var legWest = {
    name: "legWest",
    points:[{x:56,y:216}, {x:42,y:212}, {x:39,y:226}, {x:45,y:269}, {x:54,y:269}, {x:54,y:250}, {x:57,y:231}, {x:56,y:216}]
}

var footWest = {
    name: "footWest",
    points:[{x:47,y:271}, {x:30,y:290}, {x:49,y:294}, {x:58,y:276}, {x:55,y:268}, {x:47,y:271}]
}

var legEast = {
    name: "legEast",
    points:[{x:70,y:216}, {x:87,y:210}, {x:88,y:222}, {x:81,y:266}, {x:75,y:265}, {x:69,y:234}, {x:70,y:216}]
}

var footEast = {
name: "footEast",
points:[{x:75,y:266}, {x:70,y:276}, {x:82,y:296}, {x:97,y:290}, {x:84,y:273}, {x:81,y:267}, {x:75,y:266}]
}


var areas = []; // list to hold all the areas to be placed on the charImageBody
areas.push(head); // add all the areas to the areas list
areas.push(shouldersWest);
areas.push(shouldersEast);
areas.push(upperBody);
areas.push(armWest);
areas.push(handWest);
areas.push(armEast);
areas.push(handEast);
areas.push(lowerBody);
areas.push(legWest);
areas.push(footWest);
areas.push(legEast);
areas.push(footEast);


// Function to define area on a canavs
function defineArea(canvasB, area) {
    var points = area.points;
    context_charBodyImage_B = canvasB.getContext('2d');
    context_charBodyImage_B.beginPath();
    context_charBodyImage_B.moveTo(points[0].x, points[0].y);
    for (var i=1; i<points.length; i++) {
        context_charBodyImage_B.lineTo(points[i].x, points[i].y);
    }
}

function drawArea(canvasC, area) {
    defineArea(canvasC, area);
    var context_canvasC = canvasC.getContext('2d');
    context_canvasC.fillStyle = "black";
    context_canvasC.globalAlpha = 0.5; // set opacity of filled areas
    context_canvasC.fill();
    context_canvasC.stroke();
    context_canvasC.restore();
}

function selectAllCharBodyImage(event) {

    var selectAllButton_id = event.target.getAttribute('id');

    // get correct canvas based on the selectAllButton id
    var buttonNum = selectAllButton_id.replace("selectAllButton", "");
    var panelNum = parseInt(buttonNum.split(".")[1]);
    var charNum = parseInt(buttonNum.split(".")[2]);
    //console.log("panelNum: " + panelNum);
    //console.log("charNum: " + charNum);

    var selected_canvas_from_button = document.getElementById("canvas_charBodyImage" + pageNum + "." + panelNum + "." + charNum);
    //console.log(typeof selected_canvas_from_button);
    var selected_canvas_from_button_context = selected_canvas_from_button.getContext('2d');

    // clear canvas
    selected_canvas_from_button_context.globalAlpha = 1.0; // reset opacity
    selected_canvas_from_button_context.drawImage(charBodyMapImage, 0, 0, 125, 300);
    
    // reset all areas on the canvas to 'true' in pagesData
    for (var i=0; i<areas.length; i++) {
        var areaVar = areas[i]
        var areaName = areas[i].name;
        pagesData[pageNum].panels[(panelNum-1)].characters[charNum].areasShown[areaName] = true;
        defineArea(selected_canvas_from_button, areaVar);
        drawArea(selected_canvas_from_button, areaVar);
        }
    //console.log(pagesData[pageNum].panels[(panelNum-1)].characters[charNum].areasShown);
    
} // end of selectAllCharBodyImage(e)

function clearAllCharBodyImage(event) {
    
    var clearAllButton_id = event.target.getAttribute('id');
    
    // get correct canvas based on the selectAllButton id
    var buttonNum = clearAllButton_id.replace("clearAllButton", "");
    var panelNum = parseInt(buttonNum.split(".")[1]);
    var charNum = parseInt(buttonNum.split(".")[2]);
    //console.log("panelNum: " + panelNum);
    //console.log("charNum: " + charNum);
    
    var selected_canvas_from_button = document.getElementById("canvas_charBodyImage" + pageNum + "." + panelNum + "." + charNum);
    //console.log(typeof selected_canvas_from_button);
    var selected_canvas_from_button_context = selected_canvas_from_button.getContext('2d');
    
    // clear canvas
    selected_canvas_from_button_context.globalAlpha = 1.0; // reset opacity
    selected_canvas_from_button_context.drawImage(charBodyMapImage, 0, 0, 125, 300);
    
    // reset all areas on the canvas to 'true' in pagesData
    for (var i=0; i<areas.length; i++) {
        var areaVar = areas[i]
        var areaName = areas[i].name;
        pagesData[pageNum].panels[(panelNum-1)].characters[charNum].areasShown[areaName] = false;
    }
    //console.log(pagesData[pageNum].panels[(panelNum-1)].characters[charNum].areasShown);
    
} // end of function clearAllCharBodyImage(event)

function drawSelectedAreasOnCharBodyImage(canvas, panelNum, charFigureNum) {
    // clear canvas
    canvas.getContext.globalAlpha = 1.0; // reset opacity
    canvas.getContext('2d').drawImage(charBodyMapImage, 0, 0, 125, 300);
    
    //console.log(canvas.id);
    
    for (var i=0; i<areas.length; i++) {
        var areaVar = areas[i]
        var areaName = areas[i].name;
        if (pagesData[pageNum].panels[panelNum].characters[charFigureNum].areasShown[areaName] == true) {
            defineArea(canvas, areaVar);
            drawArea(canvas, areaVar);
        }
    }
} // end of function drawSelectedAreasOnCharBodyImage()


// function to handle clicking on charBodyImage canvases
function handleMouseClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var canvas_id = event.target.id;
    var selected_canvas = document.getElementById(canvas_id);
    var context_selected_canvas = selected_canvas.getContext('2d');
    
    reOffset_charBodyImage(selected_canvas);
    
    var mousex = parseInt(e.clientX - recOffsetX_charBodyImage);
    var mousey = parseInt(e.clientY - recOffsetY_charBodyImage);
    
    //console.log("e.clientX: " + e.clientX);
    //console.log("e.clientY: " + e.clientY);
    //console.log("recOffsetX_charBodyImage: " + recOffsetX_charBodyImage);
    //console.log("recOffsetY_charBodyImage: " + recOffsetY_charBodyImage);
    //console.log("x:", + mousex + ", y:" + mousey);
    
    // reset border to black in case it has been changed to lightpink
    selected_canvas.style.border = '3px solid black';
    
    // clear canvas
    context_selected_canvas.globalAlpha = 1.0; // reset opacity
    context_selected_canvas.drawImage(charBodyMapImage, 0, 0, 125, 300);
    
    //console.log("canvas id: " + canvas_id);
    var canvasNum = canvas_id.replace("canvas_charBodyImage", "");
    //console.log("canvasNum: " + canvasNum);
    var panelNum = parseInt(canvasNum.split(".")[1]-1);
    //console.log("panelNum: " + panelNum);
    var charFigureNum = parseInt(canvasNum.split(".")[2]);
    //console.log("charFigureNum: " + charFigureNum);
    
    // set the switches for the depicted areas in pagesData
    
    for (var i=0; i<areas.length; i++) {
        var area = areas[i];
        defineArea(selected_canvas, area);
        if (context_selected_canvas.isPointInPath(mousex, mousey)) {
            var clickedArea = pagesData[pageNum].panels[panelNum].characters[charFigureNum].areasShown[area.name];
            if (clickedArea == false) {
                pagesData[pageNum].panels[panelNum].characters[charFigureNum].areasShown[area.name] = true;
            }
            else {
                pagesData[pageNum].panels[panelNum].characters[charFigureNum].areasShown[area.name] = false;
            }
        }
    }
    //console.log(pagesData[pageNum].panels[panelNum].characters[charFigureNum].areasShown); // Debuggggg
    
    // draw the selected areas on the canvas
    drawSelectedAreasOnCharBodyImage(selected_canvas, panelNum, charFigureNum);
    
} // end of function handleMouseClick(e)





/* Character Orientation - Clickable Canvas with Rotatable Image */
// code adapted from http://jsfiddle.net/m1erickson/QqwKR/ and https://stackoverflow.com/questions/19229319/to-rotation-an-image-in-canvas-using-mouse

// Get correct X and Y Coords for the charOrientation Canvases
var recOffsetX_charOrientation, recOffsetY_charOrientation; // Declare coords variables

// function to get the correct coords relative to the canvas
function reOffset_charOrientation(chosen_canvas) {
    var BB_charOrientation = chosen_canvas.getBoundingClientRect();
    recOffsetX_charOrientation = BB_charOrientation.left;
    recOffsetY_charOrientation = BB_charOrientation.top;
}

// init object to hold variables to track positions and elements on canvases
var vars_charOrientation = {}; // these are specific to the canvas and change

// these are for all canvases and do not change
var cx, cy;


function drawOrientationImage(canvas_this_id) {
    
    var reset_x =  charOrientationImage.width / -2; // image width / -2
    var reset_y =  charOrientationImage.height / -2; // image height / -2
    //console.log(reset_x, reset_y);
    var getCanvas = document.getElementById(canvas_this_id);
    var context_canvas_this = getCanvas.getContext('2d');
    
    // redraw purple circle each time
    context_canvas_this.beginPath();
    context_canvas_this.arc(cx, cy, 80, 0, 2 * Math.PI, false);
    context_canvas_this.fillStyle = '#7E06DA';
    context_canvas_this.fill();
    context_canvas_this.restore();
    
    context_canvas_this.save();
    context_canvas_this.translate(cx, cy);
    context_canvas_this.rotate(vars_charOrientation[canvas_this_id].r);
    context_canvas_this.drawImage(charOrientationImage, reset_x-1, reset_y);
    context_canvas_this.restore();
    
} // end of drawOrientationImage()



// Object with mouse handling functions for the char orientation task
var rotateImage = {
    
    handleMouseDown:function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // get the correct canvas
        var canvas_orientation_id = event.target.id;
        var selected_canvas_orientation = document.getElementById(canvas_orientation_id);
        var context_selected_canvas_orientation = selected_canvas_orientation.getContext('2d');
        
        // get the correct mouse pos
        reOffset_charOrientation(selected_canvas_orientation);
        
        var hamsterx = parseInt(e.clientX - recOffsetX_charOrientation);
        var hamstery = parseInt(e.clientY - recOffsetY_charOrientation);
        //console.log("handleMouseDown activated");
        //console.log("x coord: " + hamsterx + ", " + "y coord: " + hamstery);
        drawOrientationImage(canvas_orientation_id);
        vars_charOrientation[canvas_orientation_id].isDown = true;

    },
    
    handleMouseUp:function(e) {
        // get the correct canvas
        var canvas_orientation_id = event.target.id;
        var selected_canvas_orientation = document.getElementById(canvas_orientation_id);
        var context_selected_canvas_orientation = selected_canvas_orientation.getContext('2d');
        
        vars_charOrientation[canvas_orientation_id].isDown = false;
        
        //console.log("cx, cy: " + cx, cy);
        //console.log(vars_charOrientation[canvas_orientation_id].r);
        
    },
    
    handleMouseOut:function(e) {
        // get the correct canvas
        var canvas_orientation_id = event.target.id;
        var selected_canvas_orientation = document.getElementById(canvas_orientation_id);
        var context_selected_canvas_orientation = selected_canvas_orientation.getContext('2d');
        
        vars_charOrientation[canvas_orientation_id].isDown = false;
    },
    
    handleMouseMove:function(e) {
        // get the correct canvas
        //console.log("handleMouseMove activated");
        var canvas_orientation_id = event.target.id;
        //console.log(canvas_orientation_id);
        var selected_canvas_orientation = document.getElementById(canvas_orientation_id);
        
        isDown_value = vars_charOrientation[canvas_orientation_id].isDown;
        // console.log(isDown_value);
        
        if (!isDown_value) {
            return;
        }
        // get the correct mouse pos
        reOffset_charOrientation(selected_canvas_orientation);
        
        var hamsterx = parseInt(e.clientX - recOffsetX_charOrientation); // get coords
        var hamstery = parseInt(e.clientY - recOffsetY_charOrientation);
        var dx = hamsterx - cx; // get mouse pos distance away from canvas center
        var dy = hamstery - cy;
        //console.log(hamsterx, hamstery);
        //console.log(dx, dy)
        var angle = Math.atan2(dy, dx); // get the angle between the positive x axis and the point dy, dx
        vars_charOrientation[canvas_orientation_id].r = angle;
        drawOrientationImage(canvas_orientation_id);
    }
    
} // end of rotateImage object




/* Create Char Features Form - Function to create a Char Form for the Character Features Task */
function createCharFeaturesForm(x, y) {
    // x = the int that indicates the number of this char - newCharIndex
    // y = the current panel/page segmentation number
    
    // Create a new form object with the char number/ID
    var charFeaturesForm = document.createElement("form");
    charFeaturesForm.setAttribute('method',"post");
    charFeaturesForm.setAttribute('action',"true");
    charFeaturesForm.id = "charFeatureForm" + x;
    charFeaturesForm.setAttribute("class", "charFeaturesForms");
    
    // Char Number ID - put in the corner of each charFeaturesForm
    var charIDSquareContainer = document.createElement('div'); // create container
    charIDSquareContainer.setAttribute('id', "charIDSquareContainer" + y + "." + x);
    charIDSquareContainer.setAttribute("class", "charIDSquareContainer");
    var charIDSquare = document.createElement('div');
    charIDSquare.setAttribute('id', "charIDSquare" + y + "." + x);
    charIDSquare.setAttribute("class", "charIDSquare");
    var char_id_num_here = x+1;
    charIDSquare.innerHTML = char_id_num_here;
    
    charIDSquareContainer.appendChild(charIDSquare); // put charIDSquare into container
    
    // Character Reference Area on the Form:
    
    // create container
    var charReferenceTasksContainer = document.createElement('div');
    charReferenceTasksContainer.id = "charReferenceTasksContainer" + y + "." + x;
    charReferenceTasksContainer.setAttribute("class", "charReferenceTasksContainer");
    
    // create heading
    var charReferenceSectionHeading = document.createElement('h4');
    charReferenceSectionHeading.setAttribute('id', "charReferenceSectionHeading" + y + "." + x);
    charReferenceSectionHeading.setAttribute("class", "headingsInCharForm");
    charReferenceSectionHeading.innerHTML = "Reference and Description";
    
    
    // Text input box for the character reference variable
    var charFeaturesFormInput = document.createElement("input");
    charFeaturesFormInput.setAttribute('type',"text");
    //charFeaturesFormInput.setAttribute('name',"characterVariable");
    charFeaturesFormInput.setAttribute("class", "charFeaturesFormInput");
    charFeaturesFormInput.value = charLabelInstruction;
    charFeaturesFormInput.setAttribute('id', "charFeaturesFormInput" + y +  "." + x);
    //charFormInput.addEventListener("onchange", placeCharLabelOnCanvas, false);
    charFeaturesFormInput.setAttribute('onInput', "placeCharLabelOnCanvas()"); // add event listener to put label on the canvas
    charFeaturesFormInput.addEventListener('keyup', function(e) {getInputValue_NoKeyPressedForOneSec(e)}); // add event listener to get and store input values
    
    var datalist = document.createElement('datalist');
    var datalist_id = "datalist" + y +  "." + x;
    datalist.setAttribute('id', datalist_id);
    document.body.appendChild(datalist);
    //console.log(datalist.id);
    charFeaturesFormInput.setAttribute('list', datalist_id);
    
    // Label for the character form input
    var charFeaturesFormInputLabel = document.createElement("label");
    charFeaturesFormInputLabel.setAttribute("for", "charFeaturesFormInput" + y +  "." + x);
    charFeaturesFormInputLabel.innerHTML = "Character Label: ";
    //console.log("char input ID: " + charFormInput.id); //test
    
    // Character description section
    // create div to group the label and button
    var charDescriptionContainer = document.createElement('div');
    charDescriptionContainer.setAttribute('id', "charDescriptionContainer" + y +  "." + x);
    charDescriptionContainer.setAttribute("class", "charDescriptionContainer"); 
    
    // label for button asking whether there was a change in category/description
    var charDescriptionButtonLabel = document.createElement("label"); // create label
    charDescriptionButtonLabel.setAttribute("for", "charDescriptionButton" + y +  "." + x);
    charDescriptionButtonLabel.innerHTML = "Change in Description/Category ";
    charDescriptionButtonLabel.setAttribute('id', "charDescriptionButtonLabel" + y +  "." + x);
    
    // button asking whether there was a change in category/description
    var charDescriptionButton = document.createElement("input"); // create checkbox
    charDescriptionButton.setAttribute("type", "checkbox");
    charDescriptionButton.setAttribute("name", "charDescriptionButton" + x);
    charDescriptionButton.setAttribute("value", "charDescription");
    charDescriptionButton.setAttribute('id', "charDescriptionButton" + y +  "." + x);
    // if selected, show a text input box to put in the new description
    charDescriptionButton.setAttribute("onchange", "charDescriptionButtonEvent()");  // add event handler
    
    // Character emotion section
    // create div to group the label and dropdown menu
    var charEmotionContainer = document.createElement('div');
    charEmotionContainer.setAttribute('id', "charEmotionContainer" + y +  "." + x);
    charEmotionContainer.setAttribute("class", "charEmotionContainer");
    
    // label for emotion dropdown menu
    var charEmotionSelectLabel = document.createElement("label");
    charEmotionSelectLabel.setAttribute("for", "charEmotionSelect" + y +  "." + x);
    charEmotionSelectLabel.innerHTML = "Emotion Depicted: ";
    charEmotionSelectLabel.setAttribute('id', "charEmotionSelectLabel" + y +  "." + x);
    
    // character emotion - dropdown menu
    var charEmotionSelect = document.createElement("select");
    charEmotionSelect.id = "charEmotionSelect" + y +  "." + x;
    charEmotionSelect.setAttribute("onchange", "changeSelecttoWhite()");
    
    var selectEmotion = document.createElement('option');
    selectEmotion.selected = "";
    selectEmotion.innerHTML = "Select an Emotion";
    
    var emotionAnger = document.createElement('option');
    emotionAnger.value = "Anger";
    emotionAnger.innerHTML = "Anger";
    
    var emotionSurprise = document.createElement('option');
    emotionSurprise.value = "Surprise";
    emotionSurprise.innerHTML = "Surprise";
    
    var emotionDisgust = document.createElement('option');
    emotionDisgust.value = "Disgust";
    emotionDisgust.innerHTML = "Disgust";
    
    var emotionEnjoyment = document.createElement('option');
    emotionEnjoyment.value = "Enjoyment";
    emotionEnjoyment.innerHTML = "Enjoyment";
    
    var emotionFear = document.createElement('option');
    emotionFear.value = "Fear";
    emotionFear.innerHTML = "Fear";
    
    var emotionSadness = document.createElement('option');
    emotionSadness.value = "Sadness";
    emotionSadness.innerHTML = "Sadness";
    
    var emotionContempt = document.createElement('option');
    emotionContempt.value = "Contempt";
    emotionContempt.innerHTML = "Contempt";
    
    charEmotionSelect.appendChild(selectEmotion);
    charEmotionSelect.appendChild(emotionAnger);
    charEmotionSelect.appendChild(emotionSurprise);
    charEmotionSelect.appendChild(emotionDisgust);
    charEmotionSelect.appendChild(emotionEnjoyment);
    charEmotionSelect.appendChild(emotionFear);
    charEmotionSelect.appendChild(emotionSadness);
    charEmotionSelect.appendChild(emotionContempt);
    
    charEmotionContainer.appendChild(charEmotionSelectLabel);
    charEmotionContainer.appendChild(charEmotionSelect);
    
    charDescriptionContainer.appendChild(charDescriptionButtonLabel);
    charDescriptionContainer.appendChild(charDescriptionButton);
    
    // append these items to the container
    charReferenceTasksContainer.appendChild(charReferenceSectionHeading);
    charReferenceTasksContainer.appendChild(charFeaturesFormInputLabel);
    charReferenceTasksContainer.appendChild(charFeaturesFormInput);
    charReferenceTasksContainer.appendChild(charDescriptionContainer);
    charReferenceTasksContainer.appendChild(charEmotionContainer);

    console.log(charEmotionSelect.id);
    console.log(pagesData[pageNum].panels[y-1].characters[x].emotion)
    //console.log(pagesData[pageNum].panels[y-1].characters[x]);
    if (pagesData[pageNum].panels[y-1].characters[x].emotion === undefined) {
        pagesData[pageNum].panels[y-1].characters[x].emotion = "Select an Emotion";
        //console.log(pagesData[pageNum].panels[y-1].characters[x]);
    }
//    else {
//        charEmotionSelect.value = pagesData[pageNum].panels[y-1].characters[x].emotion;
//    }

    
    // Character Features Inputs (image features):
    // Code adapted from https://stackoverflow.com/questions/22317805/how-to-make-canvas-element-in-html-clickable
    
    // First, put the headings for these sections in a separate div
    var charAreasAndOrientationHeadingsContainer = document.createElement('div');
    charAreasAndOrientationHeadingsContainer.id = "charAreasAndOrientationHeadingsContainer" + y + "." + x;
    charAreasAndOrientationHeadingsContainer.setAttribute("class", "charAreasAndOrientationHeadingsContainer");
    
    // Body elements shown:
    // Heading for character parts shown
    var charBodyPartsShownHeading = document.createElement("h4");
    charBodyPartsShownHeading.id = "charBodyPartsShownHeading" + y + "." + x;
    charBodyPartsShownHeading.setAttribute("class", "areasDepictedHeading");
    charBodyPartsShownHeading.innerHTML = "Areas Depicted";
    
    // Heading for char orientation task
    var charOrientationHeading = document.createElement("h4");
    charOrientationHeading.id = "charOrientationHeading" + y + "." + x;
    charOrientationHeading.setAttribute("class", "charOrientationHeading");
    charOrientationHeading.innerHTML = "Orientation of Gaze";
    
    charAreasAndOrientationHeadingsContainer.appendChild(charBodyPartsShownHeading);
    charAreasAndOrientationHeadingsContainer.appendChild(charOrientationHeading);
    
    var charBodyMapContainer = document.createElement('div'); // create containter to hold the char body map
    charBodyMapContainer.setAttribute('id', "charBodyMapContainer" + pageNum + "." + y + "." + x); // set the id for the container
    //console.log("char body map container: ", charBodyMapContainer.id); // debug
    charBodyMapContainer.setAttribute("class", "charBodyMapContainer"); 
    
    // clone the canvas element created in the init function
    canvas_charBodyImage_clone = canvas_charBodyImage.cloneNode();
    canvas_charBodyImage_clone.id = "canvas_charBodyImage" + pageNum + "." + y + "." + x; // assign an id
    canvas_charBodyImage_clone.width = 130;
    //canvas_charBodyImage_clone.getContext('2d').globalAlpha = '1.0'; // set the opacity to 0.5 for all canvases

    canvas_charBodyImage_clone.getContext('2d').fillStyle = "white";
    canvas_charBodyImage_clone.getContext('2d').fillRect(0, 0, canvas_charBodyImage_clone.width, canvas_charBodyImage_clone.height);
    canvas_charBodyImage_clone.getContext('2d').drawImage(charBodyMapImage, 0, 0, 125, 300);
    canvas_charBodyImage_clone.getContext('2d').restore();
    //console.log("id: " + canvas_charBodyImage_clone.id);
    
    charBodyMapContainer.appendChild(canvas_charBodyImage_clone);
    
    // create a new set of area switches to the character in pagesData - set all switched to false
    var depictedCharAreas = {"head":false, "shouldersEast":false, "shouldersWest":false, "upperBody":false, "armWest":false, "handWest":false, "armEast":false, "handEast":false, "lowerBody":false, "legWest":false, "footWest":false, "legEast":false, "footEast":false};
    
    // if the page has been created once already, apply the values to the areasShown that was already created
    //console.log(pagesData[pageNum].panels[(y-1)].characters[x].areasShown);
    if (pagesData[pageNum].panels[(y-1)].characters[x].areasShown === undefined) {
        // add a new set of area switches to the character in pagesData
        pagesData[pageNum].panels[(y-1)].characters[x].areasShown = depictedCharAreas;
        // console.log(pagesData[pageNum].panels[(y-1)].characters[x]); // Deboog
    }
    
    // add mouse click event listener to each canvas
    canvas_charBodyImage_clone.addEventListener('mousedown', function(e) {handleMouseClick(e)
                            });
    
    // create "full body shown" or "select all" button
    var selectAllButton = document.createElement('BUTTON');
    selectAllButton.setAttribute('type', 'button');
    selectAllButton.id = "selectAllButton" + pageNum + "." + y + "." + x;
    selectAllButton.innerHTML = "Select All";
    selectAllButton.setAttribute("onclick", "selectAllCharBodyImage(event)");
    selectAllButton.setAttribute("class", "selectAllCharBodyMapButton");
    
    // create a "clear all" button
    var clearAllButton = document.createElement('BUTTON');
    clearAllButton.setAttribute('type', 'button');
    clearAllButton.id = "clearAllButton" + pageNum + "." + y + "." + x;
    clearAllButton.innerHTML = "Clear All";
    clearAllButton.setAttribute("onclick", "clearAllCharBodyImage(event)");
    clearAllButton.setAttribute("class", "clearAllCharBodyMapButton");
    
    // Char Orientation
    // create container
    var charOrientationContainer = document.createElement('div');
    charOrientationContainer.setAttribute('id', "charOrientationContainer" + pageNum + "." + y + "." + x);
    charOrientationContainer.setAttribute("class", "charOrientationContainer"); 
    // create canvas
    canvas_charOrientation_clone = canvas_charOrientation.cloneNode(); // clone canvas
    canvas_charOrientation_clone.id = "canvas_charOrientation" + pageNum + "." + y + "." + x; // assign an id
    charOrientation_canvasid = "canvas_charOrientation" + pageNum + "." + y + "." + x;
    
    canvas_charOrientation_clone.getContext('2d').fillStyle = "white";
    canvas_charOrientation_clone.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
    canvas_charOrientation_clone.getContext('2d').restore();
    
    
    context_charOrientation_clone = canvas_charOrientation_clone.getContext('2d');
    
    cx = canvas_charOrientation.width/2;
    cy = canvas_charOrientation.height/2;
    
    context_charOrientation_clone.beginPath();
    context_charOrientation_clone.arc(cx, cy, 80, 0, 2 * Math.PI, false);
    context_charOrientation_clone.fillStyle = '#7E06DA';
    context_charOrientation_clone.fill();
    context_charOrientation_clone.restore();
    
    context_charOrientation_clone.beginPath();
    context_charOrientation_clone.rect(80, 190, 40, 40);
    context_charOrientation_clone.fillStyle = '#7E06DA';
    context_charOrientation_clone.fill();
    context_charOrientation_clone.restore();
    
    context_charOrientation_clone.drawImage(charOrientationImage, cx-35, cy-30, 70, 60);
    
    // if the page has been created once already, apply the values to the orientationAngle that was already created
    ///console.log(vars_charOrientation);
    //console.log(pagesData[pageNum].panels[(y-1)].characters[x].orientationAngle);
    //if (pagesData[pageNum].panels[(y-1)].characters[x].orientationAngle === undefined)
    //console.log(vars_charOrientation[charOrientation_canvasid]);
    if (vars_charOrientation[charOrientation_canvasid] === undefined) {
        // create variables for each char orientation form created
        vars_charOrientation[charOrientation_canvasid] = {
            isDown : false,
            r : 0
        }
    }

    
    
    //console.log(vars_charOrientation);
    
    canvas_charOrientation_clone.addEventListener('mousedown', function(e) {rotateImage.handleMouseDown(e)});
    canvas_charOrientation_clone.addEventListener('mousemove', function(e) {rotateImage.handleMouseMove(e)});
    canvas_charOrientation_clone.addEventListener('mouseup', function(e) {rotateImage.handleMouseUp(e)});
    canvas_charOrientation_clone.addEventListener('mouseout', function(e) {rotateImage.handleMouseOut(e)});
    
    charOrientationContainer.appendChild(canvas_charOrientation_clone);
    
    
    
    // Image features (Color and Style) - Information change associated with the reference:
    // create container to hold all color/style checkboxes
    var charImageFeaturesContainer = document.createElement('div');
    charImageFeaturesContainer.setAttribute('id', "charImageFeaturesContainer" + y + "." + x);
    charImageFeaturesContainer.setAttribute("class", "charImageFeaturesContainer");
    
    // Heading for image feature sections
    var charImageFeaturesHeading = document.createElement("h4");
    charImageFeaturesHeading.id = "charImageFeaturesHeading" + y + "." + x;
    charImageFeaturesHeading.setAttribute("class", "headingsInCharForm");
    charImageFeaturesHeading.innerHTML = "Color and Style";
    
    // group for full color
    var charFullColorGroup = document.createElement('div');
    charFullColorGroup.setAttribute('id', "charFullColorGroup" + y + "." + x);
    
    var charFullColorLabel = document.createElement("label");
    charFullColorLabel.setAttribute("for", "charFullColorButton" + y + "." + x);
    charFullColorLabel.innerHTML = "Multi-Colored ";
    charFullColorLabel.setAttribute('id', "charFullColorLabel" + y + "." + x);
    
    var charFullColorButton = document.createElement("input");
    charFullColorButton.setAttribute("type", "checkbox");
    charFullColorButton.setAttribute("name", "charFullColorButton");
    charFullColorButton.setAttribute("value", "charFullColor");
    charFullColorButton.setAttribute('id', "charFullColorButton" + y + "." + x);
    charFullColorButton.setAttribute('onchange', "changeColorStyleButtonLabelsToBlack()");
    
    charFullColorGroup.appendChild(charFullColorLabel);
    charFullColorGroup.appendChild(charFullColorButton);
    
    
    // group for black and white
    var blackAndWhiteGroup = document.createElement('div');
    blackAndWhiteGroup.setAttribute('id', "blackAndWhiteGroup" + y + "." + x);
    
    var blackAndWhiteButtonLabel = document.createElement("label");
    blackAndWhiteButtonLabel.setAttribute("for", "blackAndWhiteButton" + y + "." + x);
    blackAndWhiteButtonLabel.innerHTML = "Black and White ";
    blackAndWhiteButtonLabel.setAttribute('id', "blackAndWhiteButtonLabel" + y + "." + x);
    
    var blackAndWhiteButton = document.createElement("input");
    blackAndWhiteButton.setAttribute("type", "checkbox");
    blackAndWhiteButton.setAttribute("name", "charBlackAndWhiteButton");
    blackAndWhiteButton.setAttribute("value", "charBlackAndWhite");
    blackAndWhiteButton.setAttribute('id', "blackAndWhiteButton" + y + "." + x);
    blackAndWhiteButton.setAttribute('onchange', "changeColorStyleButtonLabelsToBlack()");
    
    blackAndWhiteGroup.appendChild(blackAndWhiteButtonLabel);
    blackAndWhiteGroup.appendChild(blackAndWhiteButton);
    
    
    // group for one color or shade button
    var charOneColorGroup = document.createElement('div');
    charOneColorGroup.setAttribute('id', "charOneColorGroup" + y + "." + x);
    
    var charOneColorButtonLabel = document.createElement("label"); // create the coloring button label
    charOneColorButtonLabel.setAttribute("for", "charOneColorButton" + y + "." + x); // say what the label is for
    charOneColorButtonLabel.innerHTML = "One Color or Gradient "; // state the label text
    charOneColorButtonLabel.setAttribute('id', "charOneColorButtonLabel" + y + "." + x); // give the label an id
    
    // one color or gradient checkbox button
    var charOneColorButton = document.createElement("input"); // create coloring button
    charOneColorButton.setAttribute("type", "checkbox"); // make it a radio button
    charOneColorButton.setAttribute("name", "charOneColorButton"); // give it a name
    charOneColorButton.setAttribute("value", "charOneColor"); // give it a value
    charOneColorButton.setAttribute('id', "charOneColorButton" + y + "." + x); // set the id
    charOneColorButton.setAttribute('onchange', "changeColorStyleButtonLabelsToBlack()");
    
    charOneColorGroup.appendChild(charOneColorButtonLabel);
    charOneColorGroup.appendChild(charOneColorButton);

    
    // group for sillhouette/shadow button
    var charShadowGroup = document.createElement('div');
    charShadowGroup.setAttribute('id', "charShadowGroup" + y + "." + x);
    
    // Label for sihouette or shadow radio button
    var charSilhouetteButtonLabel = document.createElement("label"); // create the silhouette button label
    charSilhouetteButtonLabel.setAttribute("for", "charSilhouetteButton" + y + "." + x); // say what the label is for
    charSilhouetteButtonLabel.innerHTML = "Sihouette/Shadow "; // state the label text
    charSilhouetteButtonLabel.setAttribute('id', "charSilhouetteButtonLabel" + y + "." + x); // give the label an id
    
    // Silhouette or shadow radio button
    var charSilhouetteButton = document.createElement("input"); // create silhouette button
    charSilhouetteButton.setAttribute("type", "checkbox"); // make it a checkbox
    charSilhouetteButton.setAttribute("name", "charSilhouetteButton"); // give it a name
    charSilhouetteButton.setAttribute("value", "charSilhouette"); // give it a value
    charSilhouetteButton.setAttribute('id', "charSilhouetteButton" + y + "." + x); // set the id
    charSilhouetteButton.setAttribute('onchange', "changeColorStyleButtonLabelsToBlack()");
    
    charShadowGroup.appendChild(charSilhouetteButtonLabel);
    charShadowGroup.appendChild(charSilhouetteButton);
    
    
    
    // Image detail scale radio buttons
    // Likert scale code adapted from //https://stackoverflow.com/questions/3623038/a-likert-scale-in-html
    var ulImageDetailScale = document.createElement('ul'); // create unordered list
    ulImageDetailScale.setAttribute("class", "likert"); // set the likert class to the ul
    ulImageDetailScale.setAttribute('id', "ulImageDetailScale" + y + "." + x);
    
    var liLessDetail = document.createElement('li'); // create li element for the less detail label
    liLessDetail.innerHTML = "Non-Detailed"; // set the "less detail" text
    
    var li1Label = document.createElement("label");
    li1Label.setAttribute("for", "liValue1" + y + "." + x);
    li1Label.innerHTML = "1";
    li1Label.setAttribute('id', "li1Label" + y + "." + x);
    li1Label.setAttribute("class", "imageDetailScaleIndividualLabels");
    
    var li1 = document.createElement('li'); // create li element
    var liValue1 = document.createElement("input"); // create input for likert value 1
    liValue1.setAttribute("type", "radio"); // make it a radio button
    liValue1.setAttribute("name", "imageDetailScale"); // assign name to likert value
    liValue1.setAttribute("value", "1"); // assign value 1
    liValue1.setAttribute('id', "liValue1" + y + "." + x); // set the id
    liValue1.setAttribute('onchange', "changeLabelsToBlack()");
    li1.appendChild(liValue1); // append radio button input to li element
    
    var li2Label = document.createElement("label");
    li2Label.setAttribute("for", "liValue2" + y + "." + x);
    li2Label.innerHTML = "2";
    li2Label.setAttribute('id', "li2Label" + y + "." + x);
    li2Label.setAttribute("class", "imageDetailScaleIndividualLabels");
    
    var li2 = document.createElement('li'); // create li element
    var liValue2 = document.createElement("input"); // create input for likert value 2
    liValue2.setAttribute("type", "radio"); // make it a radio button
    liValue2.setAttribute("name", "imageDetailScale"); // assign name to likert value
    liValue2.setAttribute("value", "2"); // assign value 2
    liValue2.setAttribute('id', "liValue2" + y + "." + x); // set the id
    liValue2.setAttribute('onchange', "changeLabelsToBlack()");
    li2.appendChild(liValue2); // append radio button input to li element
    
    var li3Label = document.createElement("label");
    li3Label.setAttribute("for", "liValue3" + y + "." + x);
    li3Label.innerHTML = "3";
    li3Label.setAttribute('id', "li3Label" + y + "." + x);
    li3Label.setAttribute("class", "imageDetailScaleIndividualLabels");
    
    var li3 = document.createElement('li'); // create li element
    var liValue3 = document.createElement("input"); // create input for likert value 3
    liValue3.setAttribute("type", "radio"); // make it a radio button
    liValue3.setAttribute("name", "imageDetailScale"); // assign name to likert value
    liValue3.setAttribute("value", "3"); // assign value 3
    liValue3.setAttribute('id', "liValue3" + y + "." + x); // set the id
    liValue3.setAttribute('onchange', "changeLabelsToBlack()");
    li3.appendChild(liValue3); // append radio button input to li element
    
    var li4Label = document.createElement("label");
    li4Label.setAttribute("for", "liValue4" + y + "." + x);
    li4Label.innerHTML = "4";
    li4Label.setAttribute('id', "li4Label" + y + "." + x);
    li4Label.setAttribute("class", "imageDetailScaleIndividualLabels");
    
    var li4 = document.createElement('li'); // create li element
    var liValue4 = document.createElement("input"); // create input for likert value 4
    liValue4.setAttribute("type", "radio"); // make it a radio button
    liValue4.setAttribute("name", "imageDetailScale"); // assign name to likert value
    liValue4.setAttribute("value", "4"); // assign value 4
    liValue4.setAttribute('id', "liValue4" + y + "." + x); // set the id
    liValue4.setAttribute('onchange', "changeLabelsToBlack()");
    li4.appendChild(liValue4); // append radio button input to li element
    
    var li5Label = document.createElement("label");
    li5Label.setAttribute("for", "liValue5" + y + "." + x);
    li5Label.innerHTML = "5";
    li5Label.setAttribute('id', "li5Label" + y + "." + x);
    li5Label.setAttribute("class", "imageDetailScaleIndividualLabels");
    
    var li5 = document.createElement('li'); // create li element
    var liValue5 = document.createElement("input"); // create input for likert value 5
    liValue5.setAttribute("type", "radio"); // make it a radio button
    liValue5.setAttribute("name", "imageDetailScale"); // assign name to likert value
    liValue5.setAttribute("value", "5"); // assign value 5
    liValue5.setAttribute('id', "liValue5" + y + "." + x); // set the id
    liValue5.setAttribute('onchange', "changeLabelsToBlack()");
    li5.appendChild(liValue5); // append radio button input to li element
    
    var liFullDetail = document.createElement('li'); // create li element for the full detail label
    liFullDetail.innerHTML = "Full Detailed"; // set the "full detail" text
    
    ulImageDetailScale.appendChild(liLessDetail); // append less detail li text
    //ulImageDetailScale.appendChild(li1Label); // append value 1 label
    ulImageDetailScale.appendChild(li1); // append value 1
    ulImageDetailScale.appendChild(li2); // append value 2
    ulImageDetailScale.appendChild(li3); // append value 3
    ulImageDetailScale.appendChild(li4); // append value 4
    ulImageDetailScale.appendChild(li5); // append value 5
    ulImageDetailScale.appendChild(liFullDetail); // append full detail li text
    
    var imageDetailScaleLabels = document.createElement('div');
    imageDetailScaleLabels.setAttribute('id', "imageDetailScaleLabels" + y + "." + x);
    imageDetailScaleLabels.setAttribute("class", "imageDetailScaleLabels");
    
    imageDetailScaleLabels.appendChild(li1Label);
    imageDetailScaleLabels.appendChild(li2Label);
    imageDetailScaleLabels.appendChild(li3Label);
    imageDetailScaleLabels.appendChild(li4Label);
    imageDetailScaleLabels.appendChild(li5Label);
    
    charImageFeaturesContainer.appendChild(charImageFeaturesHeading);
    charImageFeaturesContainer.appendChild(charFullColorGroup);
    charImageFeaturesContainer.appendChild(blackAndWhiteGroup);
    charImageFeaturesContainer.appendChild(charOneColorGroup);
    charImageFeaturesContainer.appendChild(charShadowGroup);
    //charImageFeaturesContainer.appendChild(ulImageDetailScale);
    //var breakElementHere = document.createElement("br");
    //charImageFeaturesContainer.appendChild(breakElementHere);
    //charImageFeaturesContainer.appendChild(imageDetailScaleLabels);


     
    // Append all char input elements to the form element:
    
    charFeaturesForm.appendChild(charIDSquareContainer); // Add the char ID container
    charFeaturesForm.appendChild(charReferenceTasksContainer);
    charFeaturesForm.appendChild(charAreasAndOrientationHeadingsContainer);
    //charFeaturesForm.appendChild(charBodyPartsShownHeading); // Add the areas depicted heading
    //charFeaturesForm.appendChild(charOrientationHeading);
    charFeaturesForm.appendChild(charBodyMapContainer); // Add the char body map container
    charFeaturesForm.appendChild(charOrientationContainer); // add char orientation container
    charFeaturesForm.appendChild(charImageFeaturesContainer); // Add the char features container
    charFeaturesForm.appendChild(selectAllButton); // Add the 'select all' button
    charFeaturesForm.appendChild(clearAllButton); // Add the "clear all" button
    charFeaturesForm.appendChild(ulImageDetailScale);
    var breakElementHere = document.createElement("br");
    charFeaturesForm.appendChild(breakElementHere);
    charFeaturesForm.appendChild(imageDetailScaleLabels);
    
    // Return the constructed form to be placed on the main semantic form
    return charFeaturesForm
    
} // end of function createCharFeaturesForm()




function charDescriptionButtonEvent() {
    
    var charDescriptionButtonID = event.target.getAttribute("id"); // get the text index of the associated form
    //console.log(charDescriptionButtonID); // test
    
    var charDescriptionContainerParent = event.target.parentNode; // get the container that hold the charDescriptionButton
    
    var charDescriptionButton = document.getElementById(charDescriptionButtonID);
    //console.log(charDescriptionButton); // debug
    
    var charDescriptionButtonNum = charDescriptionButtonID.replace("charDescriptionButton", "");
    //console.log(charDescriptionButtonNum); // deeeeeezbug
    
    var currentPanelNum = (parseInt(charDescriptionButtonNum.split(".")[0]));
    //console.log(currentPanelNum); // db
    
    var currentCharFormNum = (parseInt(charDescriptionButtonNum.split(".")[1]));
    //console.log(currentCharFormNum); //db
    
    // if charDescription button is selected, add a text input
    if (charDescriptionButton.checked) {
        var charDescriptionTextInput = document.createElement("input");
        charDescriptionTextInput.setAttribute('type',"text");
        charDescriptionTextInput.setAttribute("class", "charFeaturesFormInput");
        charDescriptionTextInput.value = charDescriptionInstruction;
        charDescriptionTextInput.setAttribute('id', "charDescriptionTextInput" + currentPanelNum + "." + currentCharFormNum);
        //console.log(charDescriptionTextInput.id); // deboog
        charDescriptionTextInput.setAttribute('onInput', "makeCharDescriptionTextInputWhite()");
        charDescriptionContainerParent.appendChild(charDescriptionTextInput);
    }
    else {
        // if not checked, get rid of the text form on that form
        var getCharDescriptionTextInput = document.getElementById("charDescriptionTextInput" + currentPanelNum + "." + currentCharFormNum);
        getCharDescriptionTextInput.remove();
    }
    
} // end of charDescriptionButtonEvent()


function makeCharDescriptionTextInputWhite() {
    
    var charDescriptionInputID = event.target.getAttribute("id");
    //console.log(charDescriptionInputID);
    var charDescriptionTextInput = document.getElementById(charDescriptionInputID);
    // change the input to white just in case the background has been highlighted after validation
    charDescriptionTextInput.style.backgroundColor = "white";
} // end of makeCharDescriptionTextInputWhite()


function changeLabelsToBlack() {
    
    var detailScaleID = event.target.getAttribute("id");
    //console.log(detailScaleID);
    var detailScaleNum = detailScaleID.replace("liValue", "");
    var firstNums = parseInt(detailScaleNum.split(".")[0]);
    var lastNum = firstNums.toString().slice(-1);
    //console.log(lastNum);
    var charIndexNum = parseInt(detailScaleNum.split(".")[1]);
    //console.log(charIndexNum);

    var getValueLabel1 = document.getElementById("li1Label" + lastNum + "." + charIndexNum);
    getValueLabel1.style.color = "black";
    var getValueLabel2 = document.getElementById("li2Label" + lastNum + "." + charIndexNum);
    getValueLabel2.style.color = "black";
    var getValueLabel3 = document.getElementById("li3Label" + lastNum + "." + charIndexNum);
    getValueLabel3.style.color = "black";
    var getValueLabel4 = document.getElementById("li4Label" + lastNum + "." + charIndexNum);
    getValueLabel4.style.color = "black";
    var getValueLabel5 = document.getElementById("li5Label" + lastNum + "." + charIndexNum);
    getValueLabel5.style.color = "black";
    
    var getDetailScaleLabels = document.getElementById("ulImageDetailScale" + lastNum + "." + charIndexNum);
    getDetailScaleLabels.style.color = "black";
    
} // end of makeCharDescriptionTextInputWhite()


function changeSelecttoWhite() {
    
    var emotionSelectionID = event.target.getAttribute("id");
    var emotionSelectionNum = emotionSelectionID.replace("charEmotionSelect", "");
    var panelNumber = parseInt(emotionSelectionNum.split(".")[0]);
    var charIDNum = parseInt(emotionSelectionNum.split(".")[1]);
    
    var emotionInputSelection = document.getElementById("charEmotionSelect" + panelNumber + "." + charIDNum);
    emotionInputSelection.style.color = "black";
    var emotionValueSelected = emotionInputSelection.value;
    
    pagesData[pageNum].panels[panelNumber-1].characters[charIDNum].emotion = emotionValueSelected;
    //console.log(pagesData[pageNum].panels[panelNum].characters[charIDNum].emotion = emotionValueSelected);
} // end of changeSelecttoWhite()




function changeColorStyleButtonLabelsToBlack() {
    
    var colorAndStyleButtonID = event.target.getAttribute("id");
    var colorAndStyleNum = colorAndStyleButtonID.slice(-3);
    var sectionNum = colorAndStyleNum.split(".")[0];
    var characterNum = colorAndStyleNum.split(".")[1];
    
    var getMulticolorLabel = document.getElementById("charFullColorLabel" + sectionNum + "." + characterNum);
    getMulticolorLabel.style.color = "black";
    var getBlackAndWhiteLabel = document.getElementById("blackAndWhiteButtonLabel" + sectionNum + "." + characterNum);
    getBlackAndWhiteLabel.style.color = "black";
    var getOneColorLabel = document.getElementById("charOneColorButtonLabel" + sectionNum + "." + characterNum);
    getOneColorLabel.style.color = "black";
    var getShadowLabel = document.getElementById("charSilhouetteButtonLabel" + sectionNum + "." + characterNum);
    getShadowLabel.style.color = "black";
    
} // end of changeColorStyleButtonLabelsToBlack()




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
} // end of function createTextForm()






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
} // end function showTextSectionCharInput()






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


/* Stop the text section ID task and show the background section */
function endTextIDTask(event) {
    
    textIdON = false; // turn off the boolean for the text ID task
    
    // get the panel where the button was pressed
    currentPanelNumber = parseInt(currentPanel.getAttribute("id").replace("panelForm", ""), 10)-1;
    
    // change the button color to indicate the activity is turned on
    document.getElementById("indicateTextButton" + (currentPanelNumber+1)).style.color = "black";
    // change the button's function so that the text ID task can be activated again
    document.getElementById("indicateTextButton" + (currentPanelNumber+1)).setAttribute("onclick", "startTextIDTask(event)");
    
    
    // clone and replace canvas to turn off the event handlers
    putComicPageOnCanvas();
    drawPanelInfoOnCanvas();
    drawCharacterInfoOnCanvas();
    drawTextSectionInfoOnCanvas();
    
    // Show the Indicate Text Boxes and Buttons in the next Section
    var indicateTextButton = document.getElementById("indicateTextButton" + (currentPanelNumber+2));
    if (indicateTextButton != null) {
        indicateTextButton.style.display = "block"; // check that there is an indicate char button, and if so show it
    }
    
    // Do Not show old background form elements - this is from the previous version of the CAT:
    
    // display the next element on the form that needs to be filled out:
    // change all the elements style for display from "none" to "inline-block"
    //var newBackGroundHeading = document.getElementById("newBackgroundHeading" + (currentPanelNumber+1)).style.display = "block"; //display the heading for the section
    //var backgroundForm = document.getElementById("backgroundForm" + (currentPanelNumber+1)).style.display = "inline-block"; // display the form elements for the section
    //var backgroundLocationLabelLabel = document.getElementById("backgroundLocationLabelLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    //var backgroundLocationLabelInput = document.getElementById("backgroundLocationLabelInput" + (currentPanelNumber+1)).style.display = "inline-block";
    //var backgroundLocationInputLabel = document.getElementById("backgroundLocationInputLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    //var backgroundLocationInput = document.getElementById("backgroundLocationInput" + (currentPanelNumber+1)).style.display = "inline-block";
    //var blankBackgroundButton = document.getElementById("blankBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    //var blankBackgroundButtonLabel = document.getElementById("blankBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    //var detailedBackgroundButton = document.getElementById("detailedBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    //var detailedBackgroundButtonLabel = document.getElementById("detailedBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    //var textBackgroundButtonLabel = document.getElementById("textBackgroundButtonLabel" + (currentPanelNumber+1)).style.display = "inline-block";
    //var textBackgroundButton = document.getElementById("textBackgroundButton" + (currentPanelNumber+1)).style.display = "inline-block";
    
    // show the indicateChar button in the next section
    //var indicateCharButton = document.getElementById("indicateCharButton" + (currentPanelNumber+2));
    //if (indicateCharButton != null) {
    //indicateCharButton.style.display = "block"; // check that there is an indicate char button, and if so show it
} // end of endTextIDTask(event)



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
    
    // Show the next task:
    
    // The old method was to get the text ID task...
    //var newTextSectionHeading = document.getElementById("newTextSectionsHeading" + (currentPanelNumber+1)).style.display = "block"; //display the heading for the text section
    //var indicateTextButton = document.getElementById("indicateTextButton" + (currentPanelNumber+1)).style.display = "inline-block"; // display the form elements for the text section
    
    
    // The next task is the next Char ID task:
    // show the indicateChar button in the next section
    var indicateCharButton = document.getElementById("indicateCharButton" + (currentPanelNumber+2));
    if (indicateCharButton != null) {
        indicateCharButton.style.display = "block"; // check that there is an indicate char button, and if so show it
    }
} // end of endCharIDTask(event)



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
} // end of changeTextLabelToWhite()


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
    
} // end of changeBackgroundLabelToWhite()


/* Draw the stored panel rectangles onto the page */
function drawPanelInfoOnCanvas() {
    //console.log("drawPanelInfoOnCanvas"); //test
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // show the panels stored in the data structure
    for (var i=0; i<pagesData[pageNum].panels.length; i++) {
        var r = pagesData[pageNum].panels[i];
        context.strokeStyle = r.color;
        context.lineWidth = 4; // set lineWidth so the panels are visible
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
} // end of drawPanelInfoOnCanvas()

/* Draw the stored character rectangle info onto the page */
function drawCharacterInfoOnCanvas(errorFound) {
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
                context.fillText(char.label, char.left-6, char.top+6); // center into the circle
            }
            
            if (characterFeaturesTaskSwitch == true) {
                // replace the label with the index
                context.beginPath(); // put the circles on as well
                context.arc(char.left, char.top, 15, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = char.color_charID;
                context.fill();
                
                context.beginPath(); // draw char id variable in circle
                context.fillStyle = "white";
                context.font = "15px Arial Black";
                context.fillText(char.id, char.left-6, char.top+6); // center into the circle
                
                // if reset was pressed, just put the button id index back
                var pressedButtonID = event.target.getAttribute("id");
                //console.log(pressedButtonID);
                if (pressedButtonID == "buttonReset") {
                    
                    context.beginPath(); // put the circles on as well
                    context.arc(char.left, char.top, 15, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStyle = char.color_charID;
                    context.fill();
                    
                    context.beginPath(); // draw char id variable in circle
                    context.fillStyle = "white";
                    context.font = "15px Arial Black";
                    context.fillText(char.id, char.left-6, char.top+6); // center into the circle
                    //console.log(i, j);
                }
                
                if (pressedButtonID == "buttonPreviousPage") {
                    
                    context.beginPath(); // put the circles on as well
                    context.arc(char.left, char.top, 15, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStyle = char.color_charID;
                    context.fill();
                    
                    context.beginPath(); // draw char id variable in circle
                    context.fillStyle = "white";
                    context.font = "15px Arial Black";
                    context.fillText(char.label, char.left-6, char.top+6); // center into the circle
                }
                // if it is buttonNextPage from the validateInput that has been returned due to missing data, keep the labels on the comic page
                //console.log(errorFound);
                if (pressedButtonID == "buttonNextPage" && errorFound) {

                    context.beginPath(); // put the circles on as well
                    context.arc(char.left, char.top, 15, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStyle = char.color_charID;
                    context.fill();
                    
                    context.beginPath(); // draw char id variable in circle
                    context.fillStyle = "white";
                    context.font = "15px Arial Black";
                    // if there is a label, put that, but if there isn't (because it is a revisit to a page and the label hasn't been assigned) then put the id
                    if (char.label == "") {
                        context.fillText(char.id, char.left-6, char.top+6); // center into the circle
                    }
                    else {
                        context.fillText(char.label, char.left-6, char.top+6); // center into the circle
                    }
                }
            }
        }
    }
} // end of drawCharacterInfoOnCanvas()


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
} // end of drawTextSectionInfoOnCanvas()


/* End Page 'Next Story' Resetting Button and End Annotations */

/* Starts the annotation task with the Next Story */
function nextStory(event) {
    //console.log("It worked!"); //test
    location.href = 'https://app.prolific.co/submissions/complete?cc=8A9BF092'; // go back to prolific
}










