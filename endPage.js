

var VFLI_Form = {};



function setupSelection() {
    
    var age_num = document.getElementById("age_input_textbox").value;
    //console.log(age_num);
    
    changeToWhite("age_input_textbox");
    
    var reading_comics_age_input = document.getElementById("age_reading_comics_input");
    var age_drawing_comics_input = document.getElementById("age_drawing_comics_input");
    
    // first clear out the old options
    while (reading_comics_age_input.firstChild) {
        reading_comics_age_input.removeChild(reading_comics_age_input.lastChild);
    }
    while (age_drawing_comics_input.firstChild) {
        age_drawing_comics_input.removeChild(age_drawing_comics_input.lastChild);
    }
    
    var Select_option_reading = document.createElement('option');
    Select_option_reading.value = "0";
    Select_option_reading.innerHTML = "Select";
    reading_comics_age_input.appendChild(Select_option_reading);
    
    var Select_option_drawing = document.createElement('option');
    Select_option_drawing.value = "0";
    Select_option_drawing.innerHTML = "Select";
    age_drawing_comics_input.appendChild(Select_option_drawing);
    
    var NA_option_reading = document.createElement('option');
    NA_option_reading.value = "N/A";
    NA_option_reading.innerHTML = "N/A";
    reading_comics_age_input.appendChild(NA_option_reading);
    
    var NA_option_drawing = document.createElement('option');
    NA_option_drawing.value = "N/A";
    NA_option_drawing.innerHTML = "N/A";
    age_drawing_comics_input.appendChild(NA_option_drawing);
    
    
    var age_num_plus_one = parseInt(age_num) + 1;
    
    for (var p=1; p<age_num_plus_one; p++) {
        var option = document.createElement('option');
        option.value = p;
        option.innerHTML = p;
        reading_comics_age_input.appendChild(option);
    }
    
    for (var q=1; q<age_num_plus_one; q++) {
        var option_drawing = document.createElement('option');
        option_drawing.value = q;
        option_drawing.innerHTML = q;
        age_drawing_comics_input.appendChild(option_drawing);
    }
    
} // end of setupSelection()



function changeToWhite(id) {
    document.getElementById(id).style.backgroundColor = "white";
} // end of changeToWhite(id)



function validate_VFLI_form() {
    
    var error_exists = false;
    var VFLI_errorMessage = "";
    
    
    // Check age input
    var age_input_textbox = document.getElementById("age_input_textbox").value;
    var age_input_textbox_str = String(age_input_textbox);
    if (isNaN(age_input_textbox_str) || age_input_textbox_str == "") {
        //console.log(isNaN(age_input_textbox_str));
        error_exists = true;
        document.getElementById("age_input_textbox").style.backgroundColor = "LightPink";
        
    }
    if (!isNaN(age_input_textbox_str) && age_input_textbox_str != "") {
        VFLI_Form["age"] = age_input_textbox_str;
    }
    
    // Check gender input
    var gender_selection = document.getElementById("gender_select").value;
    if (gender_selection == "0") {
        error_exists = true;
        document.getElementById("gender_select").style.backgroundColor = "LightPink";
    }
    else {
        VFLI_Form["gender"] = gender_selection;
    }
    
    // Check Q1-16
    for (var i=1; i<17; i++) {
        var Q_value = document.getElementById("Q" + i).value;
        var Q_label = document.getElementById("Q" + i + "_label").innerHTML;
        //console.log(Q_label);
        if (Q_value == "0") {
            error_exists = true;
            document.getElementById("Q" + i).style.backgroundColor = "LightPink";
        }
        else {
            var question_num = "Q" + i;
            VFLI_Form[question_num] = Q_value;
        }
    } // end of Check Q1-16 for loop
    
    
    // Check for Q17
    var Q17_value = document.getElementById("Q17").value; 
    var Q17_label = document.getElementById("Q17_label").innerHTML; 
    if (Q17_value == "0") {
        error_exists = true;
        document.getElementById("Q17").style.backgroundColor = "LightPink";
    }
    else {
        VFLI_Form["Q17"] = Q17_value;
    }
    
    
    // Check Q18-21
    for (var j=18; j<22; j++) {
        var Q_value_cat = document.getElementById("Q" + j).value;
        var Q_label_cat = document.getElementById("Q" + j + "_label").innerHTML;
        if (Q_value_cat == "0") {
            error_exists = true;
            document.getElementById("Q" + j).style.backgroundColor = "LightPink";
        }
        else {
            var question_num_cat = "Q" + j;
            VFLI_Form[question_num_cat] = Q_value_cat;
        }
    } // end of Check Q18-21 for loop
    
    // Check began reading comics
    var reading_comics_age = document.getElementById("age_reading_comics_input").value;
    if (reading_comics_age == "0") {
        error_exists = true;
        document.getElementById("age_reading_comics_input").style.backgroundColor = "LightPink";
    }
    else {
        VFLI_Form["age_began_reading_comics"] = reading_comics_age;
    }
    
    // Check began drawing comics
    var drawing_comics_age = document.getElementById("age_drawing_comics_input").value;
    if (drawing_comics_age == "0") {
        error_exists = true;
        document.getElementById("age_drawing_comics_input").style.backgroundColor = "LightPink";
    }
    else {
        VFLI_Form["age_began_drawing_comics"] = drawing_comics_age;
    }
    
    console.log(VFLI_Form);
    
    if (error_exists == true) {
          VFLI_errorMessage = "Missing response(s). Please select a value for the highlighted question(s). \n";
    }
    
    return VFLI_errorMessage;
    
    
} // end of validate_VFLI_form()





function submitVFLI(event) {
    
    var error_Message = validate_VFLI_form();
    if (error_Message!= "") {
        alert(error_Message);
    }
    else {
        // submit to Firebase
        //convert pagesData to a JSON file
        event.preventDefault();
        var questionnaire_data = {'data' : VFLI_Form,
            'storyID': storyNum,
            'participantNum': participantNum,
            'annotationLastCompleted': annotationTaskCompleted,
            'URL' : URL
        };
        var jsonString = JSON.stringify(questionnaire_data);
        //console.log(jsonString); //test
        // use fs from Node.js to write the file to disk
        //var fs = require('fs');
        //fs.writeFile('jsonFile.json', jsonFile, 'utf8', callback);
        //db.collection("Test").add({
        //                          jsonString: jsonString
        //                          });
        
        db.collection("Background_Experiment6").add({time: Date().toLocaleString(),
                                                    jsonData: jsonString});
        
        console.log("Submit to Firebase");
        
        // show the final button to return to Prolific
        document.getElementById("submit_form_container").style.display = "none"; 
        document.getElementById("end_section_container").style.display = "block";
    }
    
} // end of submitVFLI(event)





