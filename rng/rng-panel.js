import { getAuras, setVariable, updateBest } from "./rng-roll.js";
import { updateUI } from "./rng-script.js"

let adminCode = "5555";

let allAuras = getAuras()
// Show all auras in a list for the admin
function showAllAuras() {
    const auras = allAuras
    const auraDisplay = document.getElementById("aura-display");
    auraDisplay.innerHTML = ""; // Clear previous content

    for (let rarity in auras) {
        const auraElement = document.createElement("div");
        auraElement.textContent = `${rarity}: 1/${auras[rarity]}`;
        auraDisplay.appendChild(auraElement);
    }
}

// Function to open the keypad UI
function openAdminUI() {
    // Check if the keypad area already exists
    let existingKeypad = document.getElementById("keypad-ui");
    if (existingKeypad) {
        existingKeypad.style.display = existingKeypad.style.display === "none" ? "block" : "none";
        return;
    }

    // Create a keypad UI
    let keypad = document.createElement("div");
    keypad.id = "keypad-ui";

    // Style the keypad
    keypad.style.position = "absolute";
    keypad.style.top = "40px";
    keypad.style.left = "50px";
    keypad.style.width = "300px";
    keypad.style.height = "600px";
    keypad.style.color = "white";
    keypad.style.backgroundColor = "black";
    keypad.style.zIndex = "1000";
    keypad.style.padding = "20px";
    keypad.style.border = "2px solid white";
    keypad.style.borderRadius = "10px";
    keypad.style.textAlign = "center";

    // Add keypad display and buttons
    keypad.innerHTML = `
        <h2>Enter Admin Code</h2>
        <div id="keypad-display" style="
            width: 80%;
            height: 50px;
            margin: 10px auto;
            font-size: 24px;
            background-color: white;
            color: black;
            text-align: center;
            line-height: 50px;
            border-radius: 5px;
        "></div>
        <div id="keypad-buttons" style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            justify-items: center;
            margin: 20px 0;
        ">
            ${Array.from({ length: 9 }, (_, i) => `
                <button class="keypad-btn" style="
                    font-size: 24px;
                    padding: 15px;
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    background-color: #444;
                    color: white;
                    border: 2px solid #fff;
                    cursor: pointer;
                ">${i + 1}</button>`).join("")}
            <div style="grid-column: span 3; display: flex; justify-content: space-between;">
                <button class="keypad-btn" style="
                    font-size: 24px;
                    padding: 15px;
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    background-color: #444;
                    color: white;
                    border: 2px solid #fff;
                    cursor: pointer;
                ">0</button>
            </div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 10px;">
            <button id="keypad-submit" style="
                padding: 10px 20px;
                font-size: 18px;
                background-color: green;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Submit</button>
            <button id="keypad-clear" style="
                font-size: 24px;
                padding: 15px;
                width: 80px;
                height: 80px;
                border-radius: 10px;
                background-color: #d9534f;
                color: white;
                border: 2px solid #fff;
                cursor: pointer;
            ">Clear</button>
        </div>
    `;

    // Append the keypad UI to the body
    document.body.appendChild(keypad);

    // Variables for tracking user input
    let inputCode = "";

    // Update the keypad display
    const updateDisplay = () => {
        document.getElementById("keypad-display").textContent = inputCode || "Enter Code";
    };

    // Add event listeners for keypad buttons
    document.querySelectorAll(".keypad-btn").forEach((button) => {
        button.addEventListener("click", () => {
            if (inputCode.length < 6) { // Limit code length to 6 digits
                inputCode += button.textContent;
                updateDisplay();
            }
        });
    });

    // Add event listener for the clear button
    document.getElementById("keypad-clear").addEventListener("click", () => {
        inputCode = "";
        updateDisplay();
    });

    // Add event listener for the submit button
    document.getElementById("keypad-submit").addEventListener("click", () => {
        if (inputCode === adminCode) {
            keypad.style.display = "none";
            createAdminUI();
        } else {
            alert("Incorrect Code!");
            inputCode = "";
            updateDisplay();
        }
    });

    // Initialize the display
    updateDisplay();
}

// Function to create the admin UI
function createAdminUI() {
    // Check if the admin UI already exists
    let existingArea = document.getElementById("admin-ui");
    if (existingArea) {
        existingArea.style.display = existingArea.style.display === "none" ? "block" : "none";
        return;
    }

    // Create the admin UI
    let area = document.createElement("div");
    area.id = "admin-ui";

    // Style the admin UI
    area.style.top = "40px";
    area.style.left = "50px";
    area.style.width = "50%";
    area.style.height = "70%";
    area.style.color = "white";
    area.style.backgroundColor = "black";
    area.style.zIndex = "1000";
    area.style.position = "absolute";
    area.style.padding = "20px";
    area.style.border = "2px solid white";
    area.style.borderRadius = "10px";

    // Add content to the admin UI
    area.innerHTML = `
        <button id="close-admin" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        ">X</button>
        <h1>Admin Access</h1>
        <p>Welcome to the admin panel.</p>

        <!-- Controls for managing luck, aura, rolls, and cutscenes -->
        <div style="margin-top: 20px;">
            <h3>Manage Player Data:</h3>
            <label for="luck-input">Luck: </label>
            <input type="number" id="luck-input" style="margin: 5px 0; padding: 5px;" />
            <button id="apply-luck" style="padding: 5px 10px;">Apply Luck</button><br />

            <label for="aura-select">Aura: </label>
            <select id="aura-select" style="margin: 5px 0; padding: 5px;">
            </select>
            <button id="apply-aura" style="padding: 5px 10px;">Apply Aura</button><br />

            <label for="rolls-input">Rolls: </label>
            <input type="number" id="rolls-input" style="margin: 5px 0; padding: 5px;" />
            <button id="apply-rolls" style="padding: 5px 10px;">Apply Rolls</button><br />

            <h3>All Auras:</h3>
            <div id="aura-display" style="
                max-height: 200px;
                overflow-y: auto;
                margin-top: 10px;
                padding: 10px;
                background-color: #222;
                border: 1px solid #444;
                border-radius: 5px;
            "></div>
        </div>
    `;

    // Append the admin UI to the body
    document.body.appendChild(area);

    // Populate the auras dropdown
    const auraSelect = document.getElementById("aura-select");
    for (let rarity in allAuras) {
        const option = document.createElement("option");
        option.value = rarity;
        option.textContent = `${rarity} (1/${allAuras[rarity]})`;
        auraSelect.appendChild(option);
    }

    // Show all auras in the aura-display
    const auraDisplay = document.getElementById("aura-display");
    for (let rarity in allAuras) {
        const auraElement = document.createElement("div");
        auraElement.textContent = `${rarity}: 1/${allAuras[rarity]}`;
        auraDisplay.appendChild(auraElement);
    }

    // Add event listener for the close button
    document.getElementById("close-admin").addEventListener("click", () => {
        area.style.display = "none";
    });

    // Add functionality for the "Apply" buttons
    document.getElementById("apply-luck").addEventListener("click", () => {
        let luck = document.getElementById("luck-input").value;
        alert(`Applying Luck: ${luck}`);
        setVariable(3, luck);
        updateUI();
    });

    document.getElementById("apply-aura").addEventListener("click", () => {
        let aura = document.getElementById("aura-select").value;
        alert(`Applying Aura: ${aura}`);
        setVariable(4, aura);
        updateBest(aura);
        updateUI();
    });

    document.getElementById("apply-rolls").addEventListener("click", () => {
        let rolls = document.getElementById("rolls-input").value;
        alert(`Applying Rolls: ${rolls}`);
        setVariable(1, rolls);
        updateUI();
    });
}


// Add event listener to the button
let accessButton = document.getElementById("access-admin");
accessButton.addEventListener("click", openAdminUI);