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
    loadHistory();
})
    .catch(() => {
        display.value = "Error";
    });
}
function loadHistory() {
    fetch("http://127.0.0.1:5000/history")
        .then(res => res.json())
        .then(data => {
            const historyList = document.getElementById("historyList");
            historyList.innerHTML = "";

            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item[0]} = ${item[1]}`;
                historyList.appendChild(li);
            });
        });
}
window.onload = loadHistory;
