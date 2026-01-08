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
        "X-API-KEY": "my-secret-key"
    },
    body: JSON.stringify({ expression })
})

    .then(res => res.json())
   .then(data => {
    display.value = data.result;
    loadHistory();
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
                historyText += `${item[0]} = ${item[1]} | `;
            });

            display.value = historyText.slice(0, -3);
        })
        .catch(() => {
            document.getElementById("display").value = "History Error";
        });
}

window.onload = loadHistory;
