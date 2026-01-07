const display = document.getElementById("display");

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
    const expression = display.value;

    fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ expression: expression })
    })
    .then(res => res.json())
    .then(data => {
        display.value = data.result;
    })
    .catch(() => {
        display.value = "Error";
    });
}
