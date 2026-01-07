let display = document.getElementById("display");

function appendValue(value) {
    display.value += value;
}


function clearDisplay() {
    display.value = "";
}


function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = document.getElementById("display").value;
        let result = eval(expression);
        document.getElementById("display").value = result;

        autosave(result);
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}
function autosave(result) {
    fetch("http://127.0.0.1:5000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ result: result })
    })
    .catch(err => console.error("Autosave failed:", err));
}
function appendValue(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function backspace() {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let exp = document.getElementById("display").value;

        exp = exp.replace(/\^/g, "**");

        if (exp.endsWith("%")) {
            exp = exp.replace("%", "/100");
        }

        let result = eval(exp);
        document.getElementById("display").value = result;

    } catch {
        document.getElementById("display").value = "Error";
    }
}


