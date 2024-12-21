import { roll, resetData, updateLabels, getVariable, setVariable, actiQuick, getAuras, loadData } from './rng-roll.js';
import { addToInventory, getInventory } from './rng-inventory.js';

const rarityLabel = document.getElementById("rarity-label");
const rollsLabel = document.getElementById("rolls-label");
const highestLabel = document.getElementById("highest-label");
const autoButton = document.getElementById("auto-roll-button");
const quickRollButton = document.getElementById("quick-roll-button");
const rollButton = document.getElementById("roll-button");
const resetButton = document.getElementById("reset-button");

let rolls = getVariable(1);
let best = getVariable(2);
let luck = getVariable(3);
let rarity = getVariable(4);
let autoRoll = getVariable(5);
let quickRoll = getVariable(6);

let rollables = getAuras();

let autoRollInterval = null;

let rolling = false;

// Update the labels in the HTML
function updateUI() {
    fetchVariables();
    rarityLabel.textContent = `Rarity: ${rarity}`;
    rollsLabel.textContent = `Rolls: ${rolls}`;
    highestLabel.textContent = `Best: ${best}: 1/${rollables[best] || 'Unknown'}`;
    autoButton.textContent = `Auto: ${autoRoll ? "On" : "Off"}`; 
    quickRollButton.textContent = `Quick: ${quickRoll ? "On" : "Off"}`; 
}

function saveData() {
    localStorage.setItem("rolls", rolls ? rolls: 0)
    localStorage.setItem("luck", luck ? luck: 0)
    localStorage.setItem("best", best ? best: "Common")
}

async function reset() {
    resetData();
    updateUI();
    updateLabels();
}

function fetchVariables() { 
    rolls = getVariable(1);
    best = getVariable(2);
    luck = getVariable(3);
    rarity = getVariable(4);
    autoRoll = getVariable(5);
    quickRoll = getVariable(6);
    rollables = getAuras();
    saveData();
}

async function comboRoll() {
    const aura = await roll() || None; // Assuming `roll` returns the aura
    addToInventory(aura); // Add the aura to inventory
    updateUI();
}

// Toggle quick roll
function toggleQuickRoll() {
    quickRoll = !quickRoll;
    actiQuick();
    updateUI();
}

function toggleAutoRoll() {
    autoRoll = !autoRoll;
    setVariable(5, autoRoll);
    if (autoRoll) {
        comboRoll();
        autoRollInterval = setInterval(comboRoll, 2000);
    } else {
        clearInterval(autoRollInterval);
        autoRollInterval = null;
    }
    updateUI();
}

// Event listeners
window.onload = () => {
    loadData();
    updateUI();
    updateLabels();
};

rollButton.addEventListener("click", async () => {
    if (rolling) return;
    rolling = true;
    comboRoll();
    rolling = false;
});

resetButton.addEventListener("click", reset);
autoButton.addEventListener("click", toggleAutoRoll);
quickRollButton.addEventListener("click", toggleQuickRoll);

export { updateUI };