// roll.js

let rollables = { 
    "Common": 2, 
    "Uncommon": 4, 
    "Rare": 8, 
    "Epic": 16, 
    "Insanity": 32, 
    "Dream": 64, 
    "Nightmare": 100, 
    "Godly": 250, 
    "Canvas": 360, 
    "E_-_r0r": 404,
    "Vampire": 500,
    "Drift": 560,
    "Soul-Burger": 560000000,
    "Luminosity": 1200000000
};


const rollDisplay = document.getElementById("roll-display");
let rolls = 0;
let rolling = false;
let best = "Common";
let luck = 0;
let rarity = "None";
let autoRoll = false;
let quickRoll = false;
let autoRollInterval = null;

let Variables = {
    1: rolls,
    2: best,
    3: luck,
    4: rarity,
    5: autoRoll,
    6: quickRoll
}


function updateBest(rarity) {
    if (rollables[rarity] >= rollables[best]) best = rarity;
}

function loadData() {
    rolls = localStorage.getItem("rolls") ? localStorage.getItem("rolls"): 0
    luck = localStorage.getItem("luck") ? localStorage.getItem("luck"): 0
    best = localStorage.getItem("best") ? localStorage.getItem("best"): "Common"
}

function updateVariables() {
    rolls = Variables[1];
    best = Variables[2];
    luck = Variables[3];
    rarity = Variables[4];
    autoRoll = Variables[5];
    quickRoll = Variables[6];
}


function getVariable(number) {
    Variables = {
        1: rolls,
        2: best,
        3: luck,
        4: rarity,
        5: autoRoll,
        6: quickRoll
    }
    return Variables[number];
}

function setVariable(number, value) {
    Variables = {
        1: rolls,
        2: best,
        3: luck,
        4: rarity,
        5: autoRoll,
        6: quickRoll
    }
    Variables[number] = value;
    updateVariables();
}

function actiQuick() {
    quickRoll = !quickRoll
}

function luckLogic() {
    if (luck > 0) {
        return 1 + luck / 100;
    } else if (luck < 0) {
        return Math.max(0.01, 1 - Math.abs(luck) / 100);
    }
    return 1;
}

function rollLogic() {
    let cumulativeProbability = 0;
    let luckMultiplier = luckLogic();
    let random = Math.random() * luckMultiplier;

    for (let rarityName in rollables) {
        let rarityValue = rollables[rarityName];
        cumulativeProbability += (1 / rarityValue);

        if (random <= cumulativeProbability) {
            return rarityName;
        }
    }
    return "Common";
}

async function roll() {
    if (rolling) return;
    let quick = quickRoll;
    let auto = autoRoll;
    rolling = true;

    let finalRarity = "Common";
    
    if (!quick) {
        for (let i = 0; i < 5; i++) {
            rarity = rollLogic();
            finalRarity = rarity;
            rollDisplay.textContent = rarity
            rollDisplay.style.color = getColorForRarity(rarity); // Change color based on rarity
            await sleep(500);
        }
    } else {
        rarity = rollLogic();
        finalRarity = rarity;
    }

    if (rollables[finalRarity] >= rollables[best]) best = finalRarity;

    if (!auto || !quick) {
        rollDisplay.textContent = `Final Result: ${finalRarity}`;
        rollDisplay.style.color = getColorForRarity(finalRarity); // Color for the final result
        setTimeout(() => {
            rollDisplay.textContent = '';
            rolling = false;
        }, 1000); // 1000ms = 1 second
    } else {
        rolling = false;
    }
    rolls++;
    updateLabels();
    
    return finalRarity;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getAuras() {
    return rollables
}

function resetData() {
    if (confirm("Do you wish to reset ALL data? This can NOT be undone!")) {   
        rolls = 0;
        best = "Common";
        luck = 0;
        updateLabels();
    }
}

function updateLabels() {
    // This function will update the data (this would normally be passed to the UI in script.js)
    console.log(`Rolls: ${rolls}, Best: ${best}`);
}


// Get color for rarity based on name
function getColorForRarity(rarity) {
    const colors = {
        "Common": "gray",
        "Uncommon": "green",
        "Rare": "blue",
        "Epic": "purple",
        "Insanity": "orange",
        "Dream": "cyan",
        "Nightmare": "red",
        "Godly": "gold",
        "Canvas": "pink",
        "E_-_r0r": "violet",
        "Vampire": "darkred",
        "Luminosity": "white"
    };
    return colors[rarity] || "white"; // Default to white if no color found
}

export { roll, resetData, updateLabels, getVariable, setVariable, actiQuick, getAuras, loadData , updateBest}; 