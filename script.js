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
   fetch("https://127.0.0.1:5000/calculate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "my-secret-calculator-key-2026"
    },
    body: JSON.stringify({ expression })
})
    .then(res => res.json())
    .then(data => {
    display.value = data.result;
})
    .catch(() => {
        display.value = "Error";
    });
}
function loadHistory() {
    fetch("https://127.0.0.1:5000/history")
        .then(res => res.json())
        .then(data => {
            const display = document.getElementById("display");

            if (data.length === 0) {
                display.value = "No history";
                return;
            }

            let historyText = "";

            data.forEach(item => {
                historyText += `${item[0]} = ${item[1]}\n`;
            });

            display.value = historyText;
        })
        .catch(() => {
            document.getElementById("display").value = "";
        });
}
/* 🔹 Keyboard Input Support */
document.addEventListener("keydown", (event) => {
    const key = event.key;

    // Numbers and operators
    if (
        (key >= "0" && key <= "9") ||
        ["+", "-", "*", "/", "."].includes(key)
    ) {
        appendValue(key);
    }

    // Enter or =
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    // Backspace
    else if (key === "Backspace") {
        backspace();
    }

    // Clear display
    else if (key === "Escape" || key === "Delete") {
        clearDisplay();
    }
});

window.onload = loadHistory;
