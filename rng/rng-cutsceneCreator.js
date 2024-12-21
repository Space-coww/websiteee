let cutsceneActive = false; // Prevent multiple cutscenes from starting

// Function to create the single star element
function createSingleStar(size, color) {
    const star = document.createElement("div");
    star.classList.add("single-star");
    star.style.position = "absolute";
    star.style.left = "50%";
    star.style.top = "50%";
    star.style.transform = "translate(-50%, -50%) scale(1)";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = color;
    star.style.borderRadius = "50%";
    return star;
}

// Function to animate the single star (growing and speeding up)
function animateSingleStar(star, duration) {
    let scale = 1;
    let growthRate = 0.01;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            scale += growthRate; // Gradually increase size
            growthRate += 0.0005; // Gradually speed up growth
            star.style.transform = `translate(-50%, -50%) scale(${scale})`;

            if (scale > 10) { // Stop animation when the star is sufficiently large
                clearInterval(interval);
                resolve();
            }
        }, 16); // Update every 16ms (~60fps)
    });
}

// Function to start the single-star cutscene
function startCutscene(customConfig = {}) {
    if (cutsceneActive) return; // Prevent multiple cutscenes from starting
    cutsceneActive = true;

    // Merge customConfig into cutsceneConfig
    Object.assign(cutsceneConfig, customConfig);

    // Create the cutscene container
    const cutsceneContainer = document.createElement("div");
    cutsceneContainer.id = "cutscene-container";
    cutsceneContainer.style.position = "absolute";
    cutsceneContainer.style.top = 0;
    cutsceneContainer.style.left = 0;
    cutsceneContainer.style.width = "100%";
    cutsceneContainer.style.height = "100%";
    cutsceneContainer.style.zIndex = 1000;
    cutsceneContainer.style.background = cutsceneConfig.gradient || cutsceneConfig.backgroundColor;
    cutsceneContainer.style.overflow = "hidden";
    gameArea.appendChild(cutsceneContainer);

    // Create the single star
    const star = createSingleStar(50, cutsceneConfig.starColor || "#fff");
    cutsceneContainer.appendChild(star);

    // Animate the star
    animateSingleStar(star, cutsceneConfig.duration).then(() => {
        // End the cutscene when the animation is complete
        endCutscene(cutsceneContainer);
    });
}

// Function to end the cutscene
function endCutscene(container) {
    container.style.transition = "opacity 1s";
    container.style.opacity = 0;

    setTimeout(() => {
        container.remove();
        cutsceneActive = false;
    }, 1000);
}

export { startCutscene };
