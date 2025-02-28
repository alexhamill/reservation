function init() {
    const loc = window.location.href;
    const isLocalFile = loc.startsWith("file://");

    // Check if the document has a valid doctype
    let hasValidDoctype = checkDoctype();

    if (!hasValidDoctype) {
        console.warn("Warning: This document does not have a <!DOCTYPE html> declaration.");
        addWarningFooter();
    }

    if (isLocalFile) {
        // Local file case: Include the DOCTYPE manually if necessary
        const pageContent = `<!DOCTYPE html>\n` + document.documentElement.outerHTML;

        fetch("https://html5.validator.nu/?out=json", {
            method: "POST",
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            },
            body: pageContent
        })
        .then(response => response.json())
        .then(data => {
            renderValidationResults(data);
        })
        .catch(error => {
            console.warn(error);
            renderErrorFooter();
        });

    } else {
        // Hosted file case: Use URL-based validation
        fetch("https://html5.validator.nu/?out=json&doc=" + encodeURIComponent(loc), {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            renderValidationResults(data);
        })
        .catch(error => {
            console.warn(error);
            renderErrorFooter();
        });
    }
}

// Function to check if the document has a valid <!DOCTYPE html>
function checkDoctype() {
    if (document.doctype) {
        // Check if the name of the doctype is "html" (case-insensitive)
        return document.doctype.name.toLowerCase() === "html";
    }
    return false;
}

// Helper function to add a warning to the footer if <!DOCTYPE html> is missing
function addWarningFooter() {
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }

    footer.innerHTML += `<div id="doctype-warning"><p><strong>Warning: The document is missing a <!DOCTYPE html> declaration. Validation results may not be accurate.</strong></p></div>`;
}

// Helper function to render validation results
function renderValidationResults(data) {
    console.log(data);
    let isHTMLValid = data.messages.length === 0;
    const box = document.createElement('div');
    document.body.appendChild(box);
    box.style.backgroundColor = "lightgreen";
    box.style.display = "block";
    // box.style.width = "50px";
    // box.style.height = "25px";
    box.style.position = "absolute";
    box.style.left = "0%";
    box.style.top = document.documentElement.scrollHeight;
    box.style.margin = "15px";
    const link1 = document.createElement('a');
    const link2 = document.createElement('a');
    const spacer = document.createElement('pre');
    let location2 = window.location;
    link1.href = "https://validator.w3.org/check?uri=" + location2.href;
    link2.href = "https://jigsaw.w3.org/css-validator/validator?uri=" + location2.href + "?profile=css3";
    link1.style.color = "black";
    link2.style.color = "black";
    link1.textContent = "H";
    link2.textContent = "C";
    spacer.textContent = "  "
    link1.style.display = "inline";
    link2.style.display = "inline";
    spacer.style.display = "inline";
    box.appendChild(link1);
    box.appendChild(spacer);
    box.appendChild(link2);
    let ValidatorHTML = `<div id="htmlcss"><p><strong>`;
    if (!isHTMLValid) {
        ValidatorHTML += " ";
        box.style.backgroundColor = "red";
    }
    ValidatorHTML += ` </strong></p>`;
    ValidatorHTML += `
        <p>
            <a id="vLink1" href=" "></a> 
            <a id="vLink2" href=" "></a>
        </p>
    `;
    
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }
    footer.innerHTML += ValidatorHTML;
}

// Helper function to render an error message in the footer
function renderErrorFooter() {
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }
    footer.innerHTML += `
        <div id="htmlcss">
            <p><strong>HTML/CSS validation could not be performed due to an error.</strong></p>
        </div>
        `;
}

// Call the init function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
