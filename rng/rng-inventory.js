let inventory = JSON.parse(localStorage.getItem("auraInventory") || "[]"); // Correctly parse the inventory from localStorage


function addToInventory(aura) {
    inventory.push(aura);
    localStorage.setItem("auraInventory", JSON.stringify(inventory)); // Store the updated inventory as a string
    console.log(JSON.stringify(inventory));
}

function getInventory() {
    return inventory;
}

export { addToInventory, getInventory };