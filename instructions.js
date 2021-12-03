

var check_the_checkbox;
var example_page_downloaded = false;


function check_checkbox() {
    check_the_checkbox = document.getElementById("example_form_checkbox").checked;
    console.log("checkbox: " + check_the_checkbox);
    
    if (check_the_checkbox == true && example_page_downloaded == true) {
        var button = document.getElementById("practiceButton");
        button.setAttribute("onclick", "startPracticeAnnotation()");
        button.style.opacity = 1.0;
        button.style.cursor = "pointer";
    }
}

function downloaded_example_page() {
    example_page_downloaded = true;
    console.log("page downloaded: " + example_page_downloaded);
}



window.addEventListener('load', function() {
                        setInterval(check_checkbox, 1000);
                        }, false);


