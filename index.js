function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(value) {
    return value + "%";
}

function formatRatio(value) {
    // If the value already has a colon (e.g., "1:5"), return it as is
    if (typeof value === "string" && value.includes(":")) {
        return value.trim(); // Ensure there is no extra space
    }

    // Otherwise, assume it's just a number and format it to "1:x"
    let num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return "Invalid"; // Handle non-numeric or invalid cases
    }

    return `1:${num}`;
}



function generateReport(type) {
    let storeInput = document.getElementById(`${type}Store`);
    if (!storeInput) {
        console.error(`Error: ${type} store input field not found.`);
        return;
    }

    let store = storeInput.value.trim().toUpperCase();
    if (store === "") {
        alert("Please enter or select a store.");
        return;
    }

    function getValue(id) {
        let element = document.getElementById(id);
        if (!element) {
            console.error(`Error: ${id} not found.`);
            return 0;
        }
        return parseFloat(element.value) || 0;
    }

    let todaySales = getValue(`${type}TodaySales`);
    let lastYearSales = getValue(`${type}LastYearSales`);
    let lastWeekSales = getValue(`${type}LastWeekSales`);
    let atvToday = getValue(`${type}AtvToday`);
    let atvLastYear = getValue(`${type}AtvLastYear`);
    let atvLastWeek = getValue(`${type}AtvLastWeek`);
    let multisTY = getValue(`${type}MultisTY`);
    let foundation = getValue(`${type}Foundation`);
    let perks = getValue(`${type}Perks`);
    let signUp = getValue(`${type}SignUp`);

    let lyPercentage = lastYearSales !== 0 ? (((todaySales - lastYearSales) / lastYearSales) * 100).toFixed(2) : "N/A";
    let lwPercentage = lastWeekSales !== 0 ? (((todaySales - lastWeekSales) / lastWeekSales) * 100).toFixed(2) : "N/A";

    let lyDiff = lastYearSales !== 0 ? `(${lyPercentage}%)` : "N/A";
    let lwDiff = lastWeekSales !== 0 ? `(${lwPercentage}%)` : "N/A";

    let formattedFoundation = formatRatio(foundation);
    let formattedSignUp = formatRatio(signUp);
    let formattedPerks = formatPercentage(perks);

    let report = "";
    
    if (type === "eod") {
        report = `
EOD REPORT
${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase()}
${store}

Actual: RM ${formatNumber(todaySales)}
LY: RM ${formatNumber(lastYearSales)} ${lyDiff}
LW: RM ${formatNumber(lastWeekSales)} ${lwDiff}
ATV TY: RM ${formatNumber(atvToday)}
ATV LY: RM ${formatNumber(atvLastYear)}
ATV LW: RM ${formatNumber(atvLastWeek)}

Multis : ${multisTY}
Foundation: ${formattedFoundation}
Perks: ${formattedPerks}
Sign up: ${formattedSignUp}
        `;
    } else {
        report = `
${store}
${type.toUpperCase()} TY : RM ${formatNumber(todaySales)}
${type.toUpperCase()} LW : RM ${formatNumber(lastWeekSales)} ${lwDiff}
${type.toUpperCase()} LY : RM ${formatNumber(lastYearSales)} ${lyDiff}
TY ATV : RM ${formatNumber(atvToday)}
LW ATV : RM ${formatNumber(atvLastWeek)}
LY ATV : RM ${formatNumber(atvLastYear)}
Multis : ${multisTY}
        `;
    }

    document.getElementById('result').textContent = report;
    document.getElementById('copyButton').style.display = 'block';
}




// 🔹 Attach event listeners to forms dynamically
document.addEventListener("DOMContentLoaded", function () {
    ["eod", "2PM", "4PM", "6PM"].forEach(type => {
        let form = document.getElementById(`${type}Form`);
        if (form) {
            form.onsubmit = function (event) {
                event.preventDefault();
                generateReport(type);
            };
        }
    });
});

// 🔹 Toggle forms when buttons are clicked
["eod", "2PM", "4PM", "6PM"].forEach(type => {
    let button = document.getElementById(`${type}Button`);
    if (button) {
        button.onclick = function () {
            document.querySelectorAll('.form-container').forEach(form => form.style.display = 'none');
            document.getElementById(`${type}Form`).style.display = 'block';

            document.querySelectorAll('.report-option').forEach(btn => btn.classList.remove('active', 'inactive'));
            this.classList.add('active');
        };
    }
});

// 🔹 Copy report to clipboard
document.getElementById('copyButton').onclick = function () {
    const resultText = document.getElementById('result').textContent;
    navigator.clipboard.writeText(resultText)
        .then(() => alert('Report copied to clipboard!'))
        .catch(err => console.error('Error copying text:', err));
};

document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("eodStore");
    let dropdown = document.getElementById("storeDropdown");

    // Show dropdown when input is focused
    input.addEventListener("focus", function () {
        dropdown.style.display = "block";
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!input.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    // Select store from dropdown
    dropdown.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", function () {
            input.value = this.textContent;
            dropdown.style.display = "none";
        });
    });

    // Filter dropdown options based on input
    input.addEventListener("input", function () {
        let filter = input.value.toLowerCase();
        let items = dropdown.querySelectorAll("li");

        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(filter)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        dropdown.style.display = filter ? "block" : "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    function setupDropdown(inputId, dropdownId) {
        let input = document.getElementById(inputId);
        let dropdown = document.getElementById(dropdownId);

        input.addEventListener("focus", function () {
            dropdown.style.display = "block";
        });

        document.addEventListener("click", function (event) {
            if (!input.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });

        dropdown.querySelectorAll("li").forEach(item => {
            item.addEventListener("click", function () {
                input.value = this.textContent;
                dropdown.style.display = "none";
            });
        });

        input.addEventListener("input", function () {
            let filter = input.value.toLowerCase();
            let items = dropdown.querySelectorAll("li");

            items.forEach(item => {
                if (item.textContent.toLowerCase().includes(filter)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });

            dropdown.style.display = filter ? "block" : "none";
        });
    }

    setupDropdown("eodStore", "storeDropdown");
    setupDropdown("2PMStore", "2PMStoreDropdown");
    setupDropdown("6PMStore", "6PMStoreDropdown"); 
    setupDropdown("4PMStore", "4PMStoreDropdown");
});
