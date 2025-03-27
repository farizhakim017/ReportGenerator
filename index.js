function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(value) {
    return value + "%";
}

// Convert numbers to ratios (e.g., 12 -> 1:12)
function formatRatio(value) {
    return value >= 1 ? `1:${value}` : value.toString();
}

function generateReport(type) {
    let storeInput = document.getElementById(`${type}Store`);
    if (!storeInput) {
        console.error(`Error: ${type} store input field not found.`);
        return; // Exit function if store input is not found
    }

    let store = storeInput.value.trim();
    if (store === "") {
        alert("Please enter or select a store.");
        return;
    }

    // Ensure all required inputs exist before accessing them
    function getValue(id) {
        let element = document.getElementById(id);
        if (!element) {
            console.error(`Error: ${id} not found.`);
            return 0; // Return default value if input is missing
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
    let foundationInput = document.getElementById(`${type}Foundation`);
    let perksInput = document.getElementById(`${type}Perks`);
    let signUpInput = document.getElementById(`${type}SignUp`);

    let foundation = foundationInput ? formatRatio(parseFloat(foundationInput.value) || 0) : "N/A";
    let perks = perksInput ? formatPercentage(parseFloat(perksInput.value) || 0) : "N/A";
    let signUp = signUpInput ? formatRatio(parseFloat(signUpInput.value) || 0) : "N/A";

    let reportDate = new Date();
    let formattedDate = `${reportDate.getDate()}/${reportDate.getMonth() + 1}/${reportDate.getFullYear()} ${reportDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase()}`;

    let lyPercentage = lastYearSales !== 0 ? ((todaySales - lastYearSales) / lastYearSales * 100).toFixed(2) : "N/A";
    let lwPercentage = lastWeekSales !== 0 ? ((todaySales - lastWeekSales) / lastWeekSales * 100).toFixed(2) : "N/A";

    let result = "";

    if (type === "eod") {
        result = `
EOD REPORT
${formattedDate}
${store}

Actual: RM ${formatNumber(todaySales.toFixed(2))}
LY: RM ${formatNumber(lastYearSales.toFixed(2))} (${lyPercentage}%)
LW: RM ${formatNumber(lastWeekSales.toFixed(2))} (${lwPercentage}%)
ATV TY: RM ${formatNumber(atvToday.toFixed(2))}
ATV LY: RM ${formatNumber(atvLastYear.toFixed(2))}
ATV LW: RM ${formatNumber(atvLastWeek.toFixed(2))}

Multis TY: ${multisTY.toFixed(2)}
Foundation: ${foundation}
Perks: ${perks}
Sign up: ${signUp}
        `;
    } else {
        let typeUpper = type.toUpperCase();
        let lyDiff = lastYearSales !== 0 ? ((todaySales - lastYearSales) / lastYearSales * 100).toFixed(0) : "N/A";
        let lwDiff = lastWeekSales !== 0 ? ((todaySales - lastWeekSales) / lastWeekSales * 100).toFixed(0) : "N/A";

        result = `
${store}
${typeUpper} TY : RM ${formatNumber(todaySales.toFixed(2))}
${typeUpper} LW : RM ${formatNumber(lastWeekSales.toFixed(2))} (${lwDiff}%)
${typeUpper} LY : RM ${formatNumber(lastYearSales.toFixed(2))} (${lyDiff}%)
TY ATV : RM ${formatNumber(atvToday.toFixed(2))}
LW ATV : RM ${formatNumber(atvLastWeek.toFixed(2))}
LY ATV : RM ${formatNumber(atvLastYear.toFixed(2))}
TY MULTIS : ${multisTY.toFixed(2)}
        `;
    }

    document.getElementById('result').textContent = result;
    document.getElementById('copyButton').style.display = 'block';
}


// 🔹 Attach event listeners to forms dynamically
document.addEventListener("DOMContentLoaded", function () {
    ["eod", "twoPM", "sixPM"].forEach(type => {
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
["eod", "twoPM", "sixPM"].forEach(type => {
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
    setupDropdown("twoPMStore", "twoPMStoreDropdown");
    setupDropdown("sixPMStore", "sixPMStoreDropdown");
});
