const coinsLabel = document.getElementById("coins-label");
const gameArea = document.getElementById("game-area");
let coinRecieve = 10;

let coins = parseInt(localStorage.getItem("coins") || "0"); // Load saved coins from localStorage

// Update coin count label
function updateCoinsLabel() {
    coinsLabel.textContent = `Coins: ${coins}`;
    localStorage.setItem("coins", coins); // Save the updated coin count to localStorage
}

// Save data to local storage
function saveData() {
    localStorage.setItem("coins", coins);
}

// Generate a random position for the coin
function getRandomPosition() {
    const areaRect = gameArea.getBoundingClientRect();
    const coinSize = 30;
    const x = Math.random() * (areaRect.width - coinSize);
    const y = Math.random() * (areaRect.height - coinSize);
    return { x, y };
}

// Check if position overlaps with the roll button
function isOverlapping(x, y) {
    const rollButtonRect = document.getElementById("roll-button").getBoundingClientRect();
    return (
        x < rollButtonRect.right &&
        x + 30 > rollButtonRect.left &&
        y < rollButtonRect.bottom &&
        y + 30 > rollButtonRect.top
    );
}

// Spawn a coin
function spawnCoin() {
    const coin = document.createElement("div");
    coin.classList.add("coin");

    let position;
    do {
        position = getRandomPosition();
    } while (isOverlapping(position.x, position.y)); // Ensure no overlap with the roll button

    coin.style.left = `${position.x}px`;
    coin.style.top = `${position.y}px`;

    // Add click event to coin
    coin.addEventListener("click", () => {
        coins += coinRecieve;
        updateCoinsLabel();
        saveData();
        coin.remove();
    });

    gameArea.appendChild(coin);

    // Remove coin after 50 seconds if not clicked
    setTimeout(() => {
        if (coin.parentElement) {
            coins += coinRecieve / 2;
            saveData();
            coin.remove();
        }
    }, 50000);
}

export { updateCoinsLabel, saveData, spawnCoin };