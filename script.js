/* =========================================
   1. DARK MODE / LIGHT MODE
========================================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolioTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    themeToggle.textContent =
        document.body.classList.contains("dark-mode") ? "☀" : "☾";

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        themeToggle.textContent = isDark ? "☀" : "☾";

        localStorage.setItem(
            "portfolioTheme",
            isDark ? "dark" : "light"
        );
    });
}

/* =========================================
   2. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");

        const isOpen = navLinks.classList.contains("open");

        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", function (event) {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navLinks.classList.remove("open");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            navLinks.classList.remove("open");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* =========================================
   3. PAGE SWITCHING NAVIGATION
   Home / About / Projects / Contact
========================================= */

(function () {

    const pageViews = {
        home: [
            document.getElementById("home")
        ],

        about: [
            document.getElementById("about"),
            ...document.querySelectorAll(".education-section")
        ],

        projects: [
            document.getElementById("projects")
        ],

        contact: [
            document.getElementById("contact"),
            document.querySelector(".footer")
        ]
    };

    const allPageElements = [
        ...pageViews.home,
        ...pageViews.about,
        ...pageViews.projects,
        ...pageViews.contact
    ].filter(Boolean);

    const navigationLinks = document.querySelectorAll(
        ".nav-link"
    );

    const validPages = Object.keys(pageViews);

    function showPage(pageName, updateAddress = true) {

        if (!validPages.includes(pageName)) {
            pageName = "home";
        }

        // Hide every page first.
        allPageElements.forEach(function (element) {
            element.classList.remove("page-view-active");
            element.classList.add("page-view-hidden");
            element.setAttribute("aria-hidden", "true");
        });

        // Show only the selected page.
        pageViews[pageName].forEach(function (element) {

            if (!element) return;

            element.classList.remove("page-view-hidden");
            element.setAttribute("aria-hidden", "false");

            // Restart the fade animation.
            void element.offsetWidth;

            element.classList.add("page-view-active");
        });

        // Update the active navigation link.
        navigationLinks.forEach(function (link) {

            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + pageName
            );

        });

        // Return to the top when changing pages.
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        // Update the browser address.
        if (updateAddress) {
            history.pushState(
                { page: pageName },
                "",
                "#" + pageName
            );
        }

        // Close the mobile navigation.
        if (navLinks && menuToggle) {

            navLinks.classList.remove("open");

            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");

        }

    }

    // Handle navigation links and buttons.
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetPage = link.getAttribute("href").substring(1);

            if (validPages.includes(targetPage)) {

                event.preventDefault();

                showPage(targetPage);

            }

        });

    });

    // Support browser Back and Forward buttons.
    window.addEventListener("popstate", function () {

        const pageName = location.hash.replace("#", "");

        showPage(
            validPages.includes(pageName) ? pageName : "home",
            false
        );

    });

    // Show the correct page when the website first loads.
    const startingPage = location.hash.replace("#", "");

    showPage(
        validPages.includes(startingPage) ?startingPage : "Home",
        false
    );

})();

/* =========================================
   6. OTHER SECTION REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-content, " +
    ".skill-card, .project-card, .contact-container"
);

if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
) {
    revealElements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });
}

/* =========================================
   8. BACK TO TOP BUTTON
========================================= */

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("show", window.scrollY > 400);
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}



/* =========================================
   9. CONTACT FORM — EMAILJS
========================================= */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {

    // Initialize EmailJS
    emailjs.init({
        publicKey: "KvoJPCNSG0TZApCXf"
    });

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get the form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Check if all fields are completed
        if (!name || !email || !subject || !message) {
            formMessage.textContent = "Please complete all fields.";
            return;
        }

        // Get the Send Message button
        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        // Prevent multiple submissions
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        formMessage.textContent = "Sending your message...";

        try {

            // Send the email through EmailJS
            await emailjs.send(
                "service_44j5m0k",
                "template_mznrabc",
                {
                    name: name,
                    email: email,
                    title: subject,
                    message: message,
                    time: new Date().toLocaleString()
                }
            );

            // Successful submission
            formMessage.textContent =
                "Your message has been sent successfully! Thank you for contacting us.";

            // Clear the form only after successful sending
            contactForm.reset();

        } catch (error) {

            console.error("EmailJS Error:", error);

            formMessage.textContent =
                "Sorry, your message could not be sent. Please try again later.";

        } finally {

            // Restore the button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }

        }

    });

}

/* =========================================
   10. AUTOMATIC COPYRIGHT YEAR
========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================
   11. SECRET LOGO EASTER EGG — SNAKE GAME
   Tap the RavensTech logo 3 times to unlock.
========================================= */

(function () {
    const logo = document.querySelector(
        ".hero-image .profile-card .profile-icon"
    );

    const modal = document.getElementById("snakeModal");
    const closeButton = document.getElementById("snakeClose");
    const startButton = document.getElementById("snakeStart");
    const canvas = document.getElementById("snakeCanvas");
    const scoreDisplay = document.getElementById("snakeScore");
    const message = document.getElementById("snakeMessage");

    if (
        !logo || !modal || !closeButton ||
        !startButton || !canvas || !scoreDisplay || !message
    ) {
        console.error("Snake game: One or more HTML elements are missing.");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Snake game: Canvas is not supported.");
        return;
    }

    const tile = 20;
    const tiles = canvas.width / tile;
    const colors = {
        background: "#17121a",
        snake: "#ff4d8d",
        head: "#ff8ab3",
        food: "#ffb6d1",
        grid: "rgba(255,255,255,0.04)"
    };

    let snake = [];
    let food = { x: 8, y: 8 };
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let score = 0;
    let gameRunning = false;
    let gameOver = false;
    let gameTimer = null;
    let tapCount = 0;
    let tapTimer = null;

    function drawGame() {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;

        for (let i = 0; i <= tiles; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tile, 0);
            ctx.lineTo(i * tile, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * tile);
            ctx.lineTo(canvas.width, i * tile);
            ctx.stroke();
        }

        // Draw food.
        ctx.fillStyle = colors.food;
        ctx.beginPath();
        ctx.arc(
            food.x * tile + tile / 2,
            food.y * tile + tile / 2,
            tile / 2 - 3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw snake.
        snake.forEach(function (part, index) {
            ctx.fillStyle = index === 0 ? colors.head : colors.snake;
            ctx.beginPath();
            ctx.roundRect(
                part.x * tile + 2,
                part.y * tile + 2,
                tile - 4,
                tile - 4,
                5
            );
            ctx.fill();
        });
    }

    function placeFood() {
        let validPosition = false;

        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * tiles),
                y: Math.floor(Math.random() * tiles)
            };

            validPosition = !snake.some(function (part) {
                return part.x === food.x && part.y === food.y;
            });
        }
    }

    function stopGame() {
        gameRunning = false;

        if (gameTimer !== null) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
    }

    function showMessage(title, text, buttonText) {
        message.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "snake-action";
        button.textContent = buttonText;
        button.addEventListener("click", startGame);

        message.append(heading, paragraph, button);
        message.style.display = "flex";
    }

    function endGame() {
        stopGame();
        gameOver = true;

        if (typeof window.saveSnakePlayerScore === "function") {
            window.saveSnakePlayerScore(score);
        }

        showMessage(
            "Game Over!",
            "Your score: " + score,
            "Play Again"
        );

        drawGame();
    }

    function changeDirection(newDirection) {
        // Prevent reversing directly into the snake.
        if (
            newDirection.x === -direction.x &&
            newDirection.y === -direction.y
        ) {
            return;
        }

        nextDirection = newDirection;
    }

    function gameStep() {
        direction = nextDirection;

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // Wall collision.
        if (
            head.x < 0 || head.x >= tiles ||
            head.y < 0 || head.y >= tiles
        ) {
            endGame();
            return;
        }

        const eating = head.x === food.x && head.y === food.y;

        // Ignore the tail if it will move away this turn.
        const bodyToCheck = eating ? snake : snake.slice(0, -1);

        if (bodyToCheck.some(function (part) {
            return part.x === head.x && part.y === head.y;
        })) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (eating) {
            score += 10;
            scoreDisplay.textContent = score;
            placeFood();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function startGame() {
        stopGame();

        snake = [
            { x: 5, y: 8 },
            { x: 4, y: 8 },
            { x: 3, y: 8 }
        ];

        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        gameOver = false;

        scoreDisplay.textContent = "0";
        placeFood();
        drawGame();

        message.style.display = "none";
        gameRunning = true;
        gameTimer = setInterval(gameStep, 130);
    }

    function openGame() {
        modal.classList.add("snake-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        drawGame();
        startButton.focus();
    }

    function closeGame() {
        stopGame();
        modal.classList.remove("snake-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        logo.focus?.();
    }

    // Tap the logo three times to open the game.
    logo.addEventListener("click", function () {
        tapCount++;

        clearTimeout(tapTimer);

        tapTimer = setTimeout(function () {
            tapCount = 0;
        }, 1000);

        if (tapCount >= 3) {
            tapCount = 0;
            clearTimeout(tapTimer);
            openGame();
        }
    });

    closeButton.addEventListener("click", closeGame);
    startButton.addEventListener("click", startGame);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeGame();
        }
    });

    // Arrow keys and WASD.
    document.addEventListener("keydown", function (event) {
        if (!modal.classList.contains("snake-open")) return;

        if (event.key === "Escape") {
            closeGame();
            return;
        }

        if (!gameRunning) return;

        const key = event.key.toLowerCase();

        const directions = {
            arrowup: { x: 0, y: -1 },
            w: { x: 0, y: -1 },
            arrowdown: { x: 0, y: 1 },
            s: { x: 0, y: 1 },
            arrowleft: { x: -1, y: 0 },
            a: { x: -1, y: 0 },
            arrowright: { x: 1, y: 0 },
            d: { x: 1, y: 0 }
        };

        if (directions[key]) {
            event.preventDefault();
            changeDirection(directions[key]);
        }
    });

    // Touch controls.
    modal.querySelectorAll("[data-snake-dir]").forEach(function (button) {
        button.addEventListener("click", function () {
            if (!gameRunning) return;

            const directions = {
                up: { x: 0, y: -1 },
                down: { x: 0, y: 1 },
                left: { x: -1, y: 0 },
                right: { x: 1, y: 0 }
            };

            const selectedDirection = directions[button.dataset.snakeDir];

            if (selectedDirection) {
                changeDirection(selectedDirection);
            }
        });
    });

    // Prepare the board before the popup opens.
    snake = [
        { x: 5, y: 8 },
        { x: 4, y: 8 },
        { x: 3, y: 8 }
    ];

    drawGame();

    // Keep the logo usable with a keyboard.
    if (!logo.hasAttribute("tabindex")) {
        logo.setAttribute("tabindex", "0");
    }

    logo.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            tapCount++;

            clearTimeout(tapTimer);
            tapTimer = setTimeout(function () {
                tapCount = 0;
            }, 1000);

            if (tapCount >= 3) {
                tapCount = 0;
                openGame();
            }
        }
    });
})();


/* =========================================
   12. SNAKE GAME PLAYER PROFILES
   Custom remove confirmation + Undo.
========================================= */

(function () {
    const playerSelect = document.getElementById("snakePlayer");
    const addButton = document.getElementById("snakeAddPlayer");
    const removeButton = document.getElementById("snakeRemovePlayer");
    const newPlayerForm = document.getElementById("snakeNewPlayerForm");
    const nameInput = document.getElementById("snakePlayerName");
    const saveButton = document.getElementById("snakeSavePlayer");
    const notice = document.getElementById("snakePlayerNotice");
    const leaderboard = document.getElementById("snakeLeaderboard");

    if (
        !playerSelect || !addButton || !removeButton ||
        !newPlayerForm || !nameInput || !saveButton ||
        !notice || !leaderboard
    ) {
        console.error("Snake profiles: Check the player HTML IDs.");
        return;
    }

    const STORAGE_KEY = "ravensTechSnakePlayers";
    let players = [];
    let pendingRemoval = null;

    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (Array.isArray(saved)) {
            players = saved.filter(function (player) {
                return player &&
                    typeof player.id === "string" &&
                    typeof player.name === "string" &&
                    typeof player.bestScore === "number";
            });
        }
    } catch (error) {
        console.error("Could not load saved players.", error);
    }

    function persistPlayers() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(players)
            );
            return true;
        } catch (error) {
            notice.textContent =
                "Unable to save data in this browser.";
            return false;
        }
    }

    /* Create the Undo button automatically. */
    const undoButton = document.createElement("button");
    undoButton.type = "button";
    undoButton.id = "snakeUndoRemove";
    undoButton.textContent = "↶ Undo Remove";
    undoButton.hidden = true;
    removeButton.insertAdjacentElement("afterend", undoButton);

    /* Create a custom confirmation popup automatically. */
    const confirmOverlay = document.createElement("div");
    confirmOverlay.className = "snake-confirm-overlay";
    confirmOverlay.hidden = true;

    confirmOverlay.innerHTML = `
        <div class="snake-confirm-box"
             role="dialog"
             aria-modal="true"
             aria-labelledby="snakeConfirmTitle"
             aria-describedby="snakeConfirmText">
            <div class="snake-confirm-icon" aria-hidden="true">!</div>
            <h3 id="snakeConfirmTitle">Remove Player?</h3>
            <p id="snakeConfirmText"></p>
            <div class="snake-confirm-actions">
                <button type="button" class="snake-cancel-remove">
                    Cancel
                </button>
                <button type="button" class="snake-confirm-remove">
                    Remove Player
                </button>
            </div>
        </div>
    `;

    const snakeWindow = document.querySelector(".snake-window");

    if (!snakeWindow) {
        console.error("Snake profiles: .snake-window was not found.");
        return;
    }

    snakeWindow.appendChild(confirmOverlay);

    const confirmText = confirmOverlay.querySelector(
        "#snakeConfirmText"
    );
    const cancelRemoveButton = confirmOverlay.querySelector(
        ".snake-cancel-remove"
    );
    const confirmRemoveButton = confirmOverlay.querySelector(
        ".snake-confirm-remove"
    );

    let playerWaitingForRemoval = null;

    function renderLeaderboard() {
        leaderboard.innerHTML = "";

        const rankedPlayers = [...players].sort(function (a, b) {
            return b.bestScore - a.bestScore;
        });

        if (rankedPlayers.length === 0) {
            const item = document.createElement("li");
            item.className = "snake-empty";
            item.textContent = "No players yet. Add a player to begin!";
            leaderboard.appendChild(item);
            return;
        }

        rankedPlayers.forEach(function (player, index) {
            const item = document.createElement("li");

            const rank = document.createElement("span");
            rank.className = "snake-rank";
            rank.textContent = (index + 1) + ".";

            const playerName = document.createElement("span");
            playerName.textContent = player.name;

            const score = document.createElement("strong");
            score.className = "snake-best-score";
            score.textContent = player.bestScore;

            item.append(rank, playerName, score);
            leaderboard.appendChild(item);
        });
    }

    function renderPlayers(selectedId) {
        playerSelect.innerHTML = "";

        if (players.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Add a player to begin";
            playerSelect.appendChild(option);
        } else {
            players.forEach(function (player) {
                const option = document.createElement("option");
                option.value = player.id;
                option.textContent = player.name;
                playerSelect.appendChild(option);
            });

            const selectionExists = players.some(function (player) {
                return player.id === selectedId;
            });

            if (selectionExists) {
                playerSelect.value = selectedId;
            }
        }

        removeButton.disabled = players.length === 0;
        renderLeaderboard();
    }

    function closeConfirmation() {
        confirmOverlay.hidden = true;
        playerWaitingForRemoval = null;
    }

    function openConfirmation(player) {
        playerWaitingForRemoval = player;

        confirmText.textContent =
            'Are you sure you want to remove "' + player.name +
            '" and their saved personal-best score? You can undo this afterward.';

        confirmOverlay.hidden = false;
        cancelRemoveButton.focus();
    }

    /* Add player form. */
    addButton.addEventListener("click", function () {
        newPlayerForm.hidden = false;
        nameInput.value = "";
        notice.textContent = "";
        nameInput.focus();
    });

    function addNewPlayer() {
        const name = nameInput.value.trim();

        if (!name) {
            notice.textContent = "Please enter a player name.";
            nameInput.focus();
            return;
        }

        if (players.some(function (player) {
            return player.name.toLowerCase() === name.toLowerCase();
        })) {
            notice.textContent = "That player name already exists.";
            nameInput.focus();
            return;
        }

        const newPlayer = {
            id: (window.crypto && window.crypto.randomUUID)
                ? window.crypto.randomUUID()
                : String(Date.now()) +
                  Math.random().toString(16).slice(2),
            name: name,
            bestScore: 0
        };

        players.push(newPlayer);

        if (!persistPlayers()) {
            players.pop();
            return;
        }

        renderPlayers(newPlayer.id);
        newPlayerForm.hidden = true;
        nameInput.value = "";
        notice.textContent = "Player added successfully!";
    }

    saveButton.addEventListener("click", addNewPlayer);

    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addNewPlayer();
        }
    });

    /* Ask for confirmation before removing. */
    removeButton.addEventListener("click", function () {
        const player = players.find(function (item) {
            return item.id === playerSelect.value;
        });

        if (!player) {
            notice.textContent = "Please select a player first.";
            return;
        }

        openConfirmation(player);
    });

    cancelRemoveButton.addEventListener("click", function () {
        closeConfirmation();
        removeButton.focus();
    });

    confirmOverlay.addEventListener("click", function (event) {
        if (event.target === confirmOverlay) {
            closeConfirmation();
        }
    });

    /* Confirm the removal and keep a temporary undo copy. */
    confirmRemoveButton.addEventListener("click", function () {
        const player = playerWaitingForRemoval;

        if (!player) return;

        const index = players.findIndex(function (item) {
            return item.id === player.id;
        });

        if (index === -1) {
            closeConfirmation();
            return;
        }

        const removedPlayer = players[index];
        players.splice(index, 1);

        if (!persistPlayers()) {
            players.splice(index, 0, removedPlayer);
            renderPlayers(removedPlayer.id);
            closeConfirmation();
            return;
        }

        pendingRemoval = {
            player: removedPlayer,
            index: index
        };

        undoButton.hidden = false;
        closeConfirmation();
        renderPlayers();

        notice.textContent =
            removedPlayer.name + " was removed. Select Undo to restore them.";
    });

    /* Undo the most recent removal. */
    undoButton.addEventListener("click", function () {
        if (!pendingRemoval) return;

        const removed = pendingRemoval;

        // Prevent duplicate player IDs if the player was added again.
        if (players.some(function (player) {
            return player.id === removed.player.id;
        })) {
            notice.textContent =
                "That player already exists. Undo was not applied.";
            return;
        }

        players.splice(
            Math.min(removed.index, players.length),
            0,
            removed.player
        );

        if (!persistPlayers()) {
            players = players.filter(function (player) {
                return player.id !== removed.player.id;
            });
            return;
        }

        pendingRemoval = null;
        undoButton.hidden = true;

        renderPlayers(removed.player.id);
        notice.textContent =
            removed.player.name + " and their saved score were restored!";
    });

    playerSelect.addEventListener("change", function () {
        notice.textContent = "";
    });

    /* Save a player's personal-best score when the game ends. */
    window.saveSnakePlayerScore = function (score) {
        const activePlayer = players.find(function (player) {
            return player.id === playerSelect.value;
        });

        if (!activePlayer) {
            notice.textContent =
                "Add or select a player before playing to save scores.";
            return;
        }

        if (score > activePlayer.bestScore) {
            const previousBest = activePlayer.bestScore;
            activePlayer.bestScore = score;

            if (!persistPlayers()) {
                activePlayer.bestScore = previousBest;
                return;
            }

            notice.textContent =
                "New personal best for " + activePlayer.name + "!";
        }

        renderLeaderboard();
    };

    /* Close the confirmation with Escape. */
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            !confirmOverlay.hidden
        ) {
            closeConfirmation();
            removeButton.focus();
        }
    });

    renderPlayers();
})();
/* =========================================
   SCHOOL PROJECT DOCUMENTATION INTERACTION
========================================= */

(function () {
    const openButton = document.getElementById("schoolProjectFolder");
    const overlay = document.getElementById("schoolDocumentation");
    const windowPanel = overlay
        ? overlay.querySelector(".school-doc-window")
        : null;
    const closeButton = document.getElementById("closeSchoolDocumentation");
    const backToTopButton = document.getElementById("schoolDocBackToTop");
    const progressBar = document.getElementById("schoolDocProgress");

    // Stop safely if the required HTML elements are missing.
    if (!openButton || !overlay || !windowPanel || !closeButton) {
        return;
    }

    let previousFocus = null;

    /* OPEN THE DOCUMENTATION FOLDER */

    function openDocumentation() {
        previousFocus = document.activeElement;

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        windowPanel.scrollTop = 0;
        updateReadingProgress();

        closeButton.focus();
    }

    /* CLOSE THE DOCUMENTATION WINDOW */

    function closeDocumentation() {
        if (!overlay.classList.contains("is-open")) {
            return;
        }

        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    openButton.addEventListener("click", openDocumentation);
    closeButton.addEventListener("click", closeDocumentation);

    // Clicking the dark background closes the window.
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeDocumentation();
        }
    });

    // Escape key closes the window.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            overlay.classList.contains("is-open")
        ) {
            closeDocumentation();
        }
    });

    /* READING PROGRESS BAR */

    function updateReadingProgress() {
        if (!progressBar) return;

        const maxScroll =
            windowPanel.scrollHeight - windowPanel.clientHeight;

        const progress = maxScroll > 0
            ? (windowPanel.scrollTop / maxScroll) * 100
            : 100;

        progressBar.style.width = Math.min(100, progress) + "%";
    }

    windowPanel.addEventListener("scroll", updateReadingProgress);

    /* SCROLL TO THE TOP OF THE DOCUMENTATION */

    if (backToTopButton) {
        backToTopButton.addEventListener("click", function () {
            windowPanel.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });
    }

    /* REVEAL TOPIC CARDS AS THEY ENTER VIEW */

    const topicCards = overlay.querySelectorAll(".school-doc-item");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        topicCards.forEach(function (card) {
            card.classList.add("is-visible");
        });
    } else {
        const topicObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: windowPanel,
                threshold: 0.08
            }
        );

        topicCards.forEach(function (card) {
            topicObserver.observe(card);
        });
    }

})();

/* =========================================
   RAVENSTECH PROJECT DOCUMENTATION
   Python Collection + Snake Game Source
========================================= */

(function () {
    "use strict";

    // =====================================
    // 1. PYTHON PROGRAMS
    // =====================================

    const pythonMembers = [
        {
            name: "Didulo, Whin Krishna Marie N.",
            title: "SIMPLE CRUD SYSTEM",
            description: "Student Management System",
            code: `
# ==========================================
# SIMPLE CRUD SYSTEM
# Student Management System
# Python - GDB Online Compatible
# ==========================================

students = []

def get_grade_info(percentage):
    if percentage >= 98:
        return 1.00, "Passed", "Regular"
    elif percentage >= 96:
        return 1.25, "Passed", "Regular"
    elif percentage >= 93:
        return 1.50, "Passed", "Regular"
    elif percentage >= 90:
        return 1.75, "Passed", "Regular"
    elif percentage >= 87:
        return 2.00, "Passed", "Regular"
    elif percentage >= 84:
        return 2.25, "Passed", "Regular"
    elif percentage >= 81:
        return 2.50, "Passed", "Regular"
    elif percentage >= 78:
        return 2.75, "Passed", "Regular"
    elif percentage >= 75:
        return 3.00, "Passed", "Regular"
    elif percentage >= 70:
        return "INC", "Incomplete", "Irregular"
    else:
        return "F", "Failed", "Irregular"

# ------------------------------------------
# CREATE
# ------------------------------------------
def add_student():
    print("\n===== ADD STUDENT =====")
    
def add_student():
    print("\n===== ADD STUDENT =====")
    student_id = input("Enter Student ID: ")
    for student in students:
        if student["id"] == student_id:
            print("Error: Student ID already exists.")
            return
        
    name = input("Enter Student Name: ")
    course = input("Enter Course: ")
    year = input("Enter Year Level: ")
    age = input("Enter Age: ")
    
   # --- NSTP CHOICES ---
    print("\n--- NSTP TYPE ---")
    print("1. CWTS - Civic Welfare Training Service")
    print("2. LTS - Literacy Training Service")
    print("3. ROTC - Reserve Officers' Training Corps")
    while True:
        nstp_choice = input("Choose NSTP (1-3): ")
        if nstp_choice == "1":
            nstp_type = "CWTS"
            break
        elif nstp_choice == "2":
            nstp_type = "LTS"
            break
        elif nstp_choice == "3":
            nstp_type = "ROTC"
            break
        else:
            print("Invalid choice! Choose 1-3 only.")

    student = {
        "id": student_id,
        "name": name,
        "course": course,
        "year": year,
        "age": age,
        "grades": [],
        "gwa": "N/A",
        "remarks": "No Grade",
        "classification": "Regular",
        "nstp": nstp_type
    }
    students.append(student)
    print(f"\nStudent added with NSTP: {nstp_type}")
    print("Student added successfully!")


# ------------------------------------------
# READ - VIEW ALL
# ------------------------------------------
def view_students():
    print("\n===== STUDENT LIST =====")

    if len(students) == 0:
        print("No students found.")
        return

    print("-" * 120)
    print(f"{'ID':<15}{'NAME':<25}{'COURSE':<15}{'YEAR':<10}{'AGE':<10}{'NSTP':<8}{'GWA':<10}{'REMARKS':<10}{'CLASSIFICATION':<10}")
    print("-" * 120)
    
    for student in students:
        print(
            f"{student['id']:<15}"
            f"{student['name']:<25}"
            f"{student['course']:<15}"
            f"{student['year']:<10}"
            f"{student['age']:<10}"
            f"{student['nstp']:<10}"
            f"{student['gwa']:<10}"
            f"{student['remarks']:<10}"
            f"{student['classification']:<10}"
            )

    print("-" * 120)


# ------------------------------------------
# READ - SEARCH
# ------------------------------------------
def search_student():
    print("\n===== SEARCH STUDENT =====")

    student_id = input("Enter Student ID: ")

    for student in students:
        if student["id"] == student_id:
            print("\nStudent Found!")
            print("Student ID      :", student["id"])
            print("Name            :", student["name"])
            print("Course          :", student["course"])
            print("Year Level      :", student["year"])
            print("Age             :", student["age"])
            print("NSTP            :", student["NSTP"])
            print("GWA             :", student["gwa"])
            print("Remarks         :", student["remarks"])
            print("Classification  :", student["classification"])
            return

    print("Student not found.")


# ------------------------------------------
# UPDATE
# ------------------------------------------
def update_student():
    print("\n===== UPDATE STUDENT =====")

    student_id = input("Enter Student ID to update: ")

    for student in students:
        if student["id"] == student_id:

            print("\nCurrent Information:")
            print("Name       :", student["name"])
            print("Course     :", student["course"])
            print("Year Level :", student["year"])
            print("Age        :", student["age"])
            print("NSTP       :", student["NSTP"])

            print("\nEnter new information.")
            print("Press ENTER to keep the current value.")

            name = input("New Name: ")
            course = input("New Course: ")
            year = input("New Year Level: ")
            age = input("age: ")
            nstp = input("New NSTP (CWTS/LTS/ROTC or ENTER to keep): ").upper()

            if name != "":
                student["name"] = name

            if course != "":
                student["course"] = course

            if year != "":
                student["year"] = year
                
            if age !="":
                student["age"]= age
                
            if nstp in ["CWTS", "LTS", "ROTC"]: student["nstp"] = nstp    
                
            print("\nStudent updated successfully!")
            return

    print("Student not found.")


# ------------------------------------------
# DELETE
# ------------------------------------------
def delete_student():
    print("\n===== DELETE STUDENT =====")

    student_id = input("Enter Student ID to delete: ")

    for student in students:
        if student["id"] == student_id:

            print("\nStudent Found:")
            print("Name:", student["name"])

            confirm = input("Are you sure you want to delete? (Y/N): ")

            if confirm.upper() == "Y":
                students.remove(student)
                print("Student deleted successfully!")
            else:
                print("Delete operation cancelled.")

            return

    print("Student not found.")


    ("Student not found.")

# ------------------------------------------
# ADD GRADE
# ------------------------------------------
def add_grade():
    print("\n===== ADD GRADE =====")
    student_id = input("Enter Student ID: ")
    for student in students:
        if student["id"] == student_id:
            print(f"Student: {student['name']}")
            try:
                raw = input("Enter grades separated by comma (ex: 85,90,88): ")
                grades = [float(x.strip()) for x in raw.split(",")]
                
                average = sum(grades) / len(grades)
                gwa, remarks, classification = get_grade_info(average)
                
                student["grades"] = grades
                student["gwa"] = round(gwa, 2)
                student["remarks"] = remarks
                student["classification"] = classification
                
                print(f"GWA: {gwa:.2f} - {remarks}")
                print("Grade added successfully!")
            except:
                print("Error: Check your grades format.")
            return
    print("Student not found.")
    
def filter_by_nstp():
    print("\n===== FILTER BY NSTP =====")
    print("1. CWTS  2. LTS  3. ROTC")
    choice = input("Enter choice: ").upper()
    if choice == "1": choice = "CWTS"
    elif choice == "2": choice = "LTS"
    elif choice == "3": choice = "ROTC"
    found = False
    for s in students:
        if s["nstp"] == choice:
            print(f"{s['id']} - {s['name']} - {s['course']} - {s['nstp']}")
            found = True
    if not found:
        print(f"No students in {choice}")
    

def count_student():
    print(f"\nTotal Students: {len(students)}")
    
# ------------------------------------------
# MAIN MENU
# ------------------------------------------
def main():
    while True:
        
        print("=" * 45)
     
        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Add Grade")
        print("7. Filter by NSTP")
        print("8. Count")
        print("9. Exit")
        
        print("=" * 45)
        choice = input("Enter your choice: ")
        
        if choice == "1": 
            add_student()
            
        elif choice == "2": 
            view_students()
    
        elif choice == "3": 
            search_student()
            
        elif choice == "4": 
            update_student()
            
        elif choice == "5": 
            delete_student()
            
        elif choice == "6": 
            add_grade()
        
        elif choice == "7": 
            filter_by_nstp()
            
        elif choice == "8": 
            count_student()
            
        elif choice == "9":
            print("\nThank you for using the system!")
            break
        
        else:
            print("Invalid choice.")

# ------------------------------------------
# RUN PROGRAM
# ------------------------------------------
main()`
        },
        {
            name: "Gario, Christine B.",
            title: "SIMPLE CRUD SYSTEM",
            description: "Student Management System",
            code: `
# ==========================================
# SIMPLE CRUD SYSTEM
# Student Management System
# Python - GDB Online Compatible
# ==========================================

students = []

def get_grade_info(percentage):
    if percentage >= 98:
        return 1.00, "Passed", "Regular"
    elif percentage >= 96:
        return 1.25, "Passed", "Regular"
    elif percentage >= 93:
        return 1.50, "Passed", "Regular"
    elif percentage >= 90:
        return 1.75, "Passed", "Regular"
    elif percentage >= 87:
        return 2.00, "Passed", "Regular"
    elif percentage >= 84:
        return 2.25, "Passed", "Regular"
    elif percentage >= 81:
        return 2.50, "Passed", "Regular"
    elif percentage >= 78:
        return 2.75, "Passed", "Regular"
    elif percentage >= 75:
        return 3.00, "Passed", "Regular"
    elif percentage >= 70:
        return "INC", "Incomplete", "Irregular"
    else:
        return "F", "Failed", "Irregular"

# ------------------------------------------
# CREATE
# ------------------------------------------
def add_student():
    print("\n===== ADD STUDENT =====")
    student_id = input("Enter Student ID: ")
    for student in students:
        if student["id"] == student_id:
            print("Error: Student ID already exists.")
            return
        
    name = input("Enter Student Name: ")
    course = input("Enter Course: ")
    year = input("Enter Year Level: ")
    age = input("Enter Age: ")
    sex = input("Enter Sex: ")
    email = input("Enter Email: ")
    contact = input("Enter Contact: ")
   
    status = input("Enter Status (Enrolled/Graduated/Dropped/Transferred) [Default: Enrolled]: ")
    if status.strip() == "":
        status = "Enrolled"
   
    student = {
        "id": student_id,
        "name": name,
        "course": course,
        "year": year,
        "age": age,
        "sex": sex,
        "email": email,
        "contact": contact,
        "status": status,
        "grades": [],
        "gwa": "N/A",
        "remarks": "No Grade",
        "classification": "regular"
    }
    
    students.append(student)
    print("Student added successfully!")


# ------------------------------------------
# READ - VIEW ALL
# ------------------------------------------
def view_students():
    print("\n===== STUDENT LIST =====")

    if len(students) == 0:
        print("No students found.")
        return

    print("-" * 175)
    print(f"{'ID':<15}{'NAME':<25}{'COURSE':<15}{'YEAR':<10}{'AGE':<10}{'SEX':<10}{'EMAIL':<25}{'CONTACT':<10}{'STATUS':<15}{'GWA':<10}{'REMARKS':<10}{'CLASSIFICATION':<10}")
    print("-" * 175)
    
    for student in students:
        print(
            f"{student['id']:<15}"
            f"{student['name']:<25}"
            f"{student['course']:<15}"
            f"{student['year']:<10}"
            f"{student['age']:<10}"
            f"{student['sex']:<10}"
            f"{student['email']:<25}"
            f"{student['contact']:<10}"
            f"{student['status']:<15}"
            f"{str(student['gwa']):<10}"
            f"{student['remarks']:<10}"
            f"{student['classification']:<10}"
            )

    print("-" * 175)


# ------------------------------------------
# READ - SEARCH
# ------------------------------------------
def search_student():
    print("\n===== SEARCH STUDENT =====")

    student_id = input("Enter Student ID: ")

    for student in students:
        if student["id"] == student_id:
            print("\nStudent Found!")
            print("Student ID      :", student["id"])
            print("Name            :", student["name"])
            print("Course          :", student["course"])
            print("Year Level      :", student["year"])
            print("Age             :", student["age"])
            print("Sex             :", student["sex"])
            print("Email           :", student["email"])
            print("Contact         :", student["contact"])
            print("Status          :", student["status"])
            print("GWA             :", student["gwa"])
            print("Remarks         :", student["remarks"])
            print("Classification  :", student["classification"])
            return

    print("Student not found.")


# ------------------------------------------
# UPDATE
# ------------------------------------------
def update_student():
    print("\n===== UPDATE STUDENT =====")

    student_id = input("Enter Student ID to update: ")

    for student in students:
        if student["id"] == student_id:

            print("\nCurrent Information:")
            print("Name        :", student["name"])
            print("Course      :", student["course"])
            print("Year Level  :", student["year"])
            print("Age         :", student["age"])
            print("Sex         :", student["sex"])
            print("Email       :", student["email"])
            print("Contact     :", student["contact"])
            print("Status      :", student["status"])
             
            print("\nEnter new information.")
            print("Press ENTER to keep the current value.")

            name = input("New Name: ")
            course = input("New Course: ")
            year = input("New Year Level: ")
            age = input("New Age: ")
            sex = input("New Sex: ")
            email = input("New Email: ")
            contact = input("New Contact: ")
            status = input("New Status (Enrolled/Graduated/Dropped/Transferred): ")

            if name != "":
                student["name"] = name

            if course != "":
                student["course"] = course

            if year != "":
                student["year"] = year
                
            if age !="":
                student["age"]= age
                
            if sex != "":
                student["sex"] = sex

            if email != "":
                student["email"] = email
                
            if contact !="":
                student["contact"]= contact 
                
            if status != "":
                student["status"] = status    
                
            print("\nStudent updated successfully!")
            return

    print("Student not found.")


# ------------------------------------------
# DELETE
# ------------------------------------------
def delete_student():
    print("\n===== DELETE STUDENT =====")

    student_id = input("Enter Student ID to delete: ")

    for student in students:
        if student["id"] == student_id:

            print("\nStudent Found:")
            print("Name:", student["name"])

            confirm = input("Are you sure you want to delete? (Y/N): ")

            if confirm.upper() == "Y":
                students.remove(student)
                print("Student deleted successfully!")
            else:
                print("Delete operation cancelled.")

            return

    print("Student not found.")

# ------------------------------------------
# ADD GRADE
# ------------------------------------------
def add_grade():
    print("\n===== ADD GRADE =====")
    student_id = input("Enter Student ID: ")
    for student in students:
        if student["id"] == student_id:
            print(f"Student: {student['name']}")
            try:
                raw = input("Enter grades separated by comma (ex: 85,90,88): ")
                grades = [float(x.strip()) for x in raw.split(",")]
                
                average = sum(grades) / len(grades)
                gwa, remarks, classification = get_grade_info(average)
                
                student["grades"] = grades
                student["gwa"] = gwa if isinstance(gwa, str) else round(gwa, 2)         
                student["remarks"] = remarks
                student["classification"] = classification
             
                gwa_display = gwa if isinstance(gwa, str) else f"{gwa:.2f}"   
                print(f"GWA: {gwa_display} - {remarks}") 
                print("Grade added successfully!")
            except:
                print("Error: Check your grades format.")
            return
    print("Student not found.")

def count_student():
    print(f"\nTotal Students: {len(students)}")
    
# ------------------------------------------
# MAIN MENU
# ------------------------------------------
def main():

    while True:

        print("\n")
        print("=" * 45)
        print("      STUDENT MANAGEMENT SYSTEM")
        print("=" * 45)
        
        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Count")
        print("7. Add Grade")
        print("8. Exit")

        print("=" * 45)

        choice = input("Enter your choice: ")

        if choice == "1":
            add_student()

        elif choice == "2":
            view_students()

        elif choice == "3":
            search_student()

        elif choice == "4":
            update_student()

        elif choice == "5":
            delete_student()
            
        elif choice == "6":    
            count_student()

        elif choice == "7":
            add_grade()

        elif choice == "8":
            print("\nThank you for using the system!")
            break

        else:
            print("invalid choice.Please try again.")
            

# ------------------------------------------
# RUN PROGRAM
# ------------------------------------------
main()`
        },
        {
            name: "Member 3",
            title: "Python Program 3",
            description: "Add the third member's program description.",
            code: `# MEMBER 3 PYTHON PROGRAM

# Paste your Python code here
print("Hello from Member 3!")`

        },
        {
            name: "Valdez, Ryan G.",
            title: "SIMPLE CRUD SYSTEM",
            description: "Student Management System",
            code: `
# ==========================================
# SIMPLE CRUD SYSTEM
# Student Management System
# Python - GDB Online Compatible
# ==========================================

students = []

# ------------------------------------------
# CREATE
# ------------------------------------------
def add_student():
    print("\n===== ADD STUDENT =====")

    student_id = input("Enter Student ID: ")
    
    for student in students:
        if student["id"] == student_id:
            print("Error: Student ID already exists.")
            return

    name = input("Enter Student Name: ")
    age = input("Enter Age: ")
    course = input("Enter Course: ")
    year = input("Enter Year Level: ")

    student = {
        "id": student_id,
        "name": name,
        "course": course,
        "year": year,
        "age": age
        }

    students.append(student)

    print("\n===== ADD GRADE =====")
    
    for student in students:
        if student["id"] == student_id:
            print(f"Student: {student['name']}")
    
            try:
                # Enter 9 grades
                raw = input("Enter grades separated by comma: ")

                grades = [float(x.strip()) for x in raw.split(",")]

                gwa = sum(grades) / len(grades)

                if gwa == 1.00:
                    remarks = "Excellent"
                elif 1.01 <= gwa <= 1.99:
                    remarks = "Very Good"
                elif 2.00 <= gwa <= 2.74:
                    remarks = "Good/Satisfactory"
                elif 2.75 <= gwa <= 3.00:
                    remarks = "Passing"
                elif 3.01 <= gwa <= 4.00:
                    remarks = "Failing/Conditional"
                elif gwa == 5.00:
                    remarks = "Failed"
                else:
                    remarks = "Invalid GWA"

                student["gwa"] = round(gwa, 2)
                student["remarks"] = remarks
    
                print("Student Grade Added Successfully!")
                print(f"GWA: {student['gwa']:.2f}")
                print(f"Remarks: {student['remarks']}")
    
            except:
                print("Error: Check your grades format.")
    
            return
    
    print("Student not found.")
    
    
    def count_student():
        print(f"\nTotal Students: {len(students)}")
        
    raw = {
    grades: "Ennter grades separated by comma: "
    }
        
# ------------------------------------------
# READ - VIEW ALL
# ------------------------------------------
def view_students():
    print("\n===== STUDENT LIST =====")

    if len(students) == 0:
        print("No students found.")
        return

    print("-" * 105)
    print(f"{'ID':<15}{'NAME':<25}{'AGE':<10}{'COURSE':<15}{'YEAR':<10}{'GWA':<10}{'REMARKS':<15}")
    print("-" * 105)

    for student in students:
        print(
            f"{student['id']:<15}"
            f"{student['name']:<25}"
            f"{student['age']:<10}"
            f"{student['course']:<15}"
            f"{student['year']:<10}"
            f"{student['gwa']:<10}"
            f"{student['remarks']:<15}"
            )

    print("-" * 105)


# ------------------------------------------
# READ - SEARCH
# ------------------------------------------
def search_student():
    print("\n===== SEARCH STUDENT =====")

    student_id = input("Enter Student ID: ")

    for student in students:
        if student["id"] == student_id:
            print("\nStudent Found!")
            print("Student ID :", student["id"])
            print("Name       :", student["name"])
            print("Course     :", student["course"])
            print("Year Level :", student["year"])
            print("Age        :", student["age"])
            return

    print("Student not found.")


# ------------------------------------------
# UPDATE
# ------------------------------------------
def update_student():
    print("\n===== UPDATE STUDENT =====")

    student_id = input("Enter Student ID to update: ")

    for student in students:
        if student["id"] == student_id:

            while True:
                print("\n===== SELECT WHAT TO EDIT =====")
                print("1. Name")
                print("2. Course")
                print("3. Year Level")
                print("4. Age")
                print("5. Grades")
                print("6. Cancel")

                choice = input("Enter your choice: ")

                if choice == "1":
                    print("\nCurrent Name:", student["name"])
                    new_name = input("Enter New Name: ")

                    if new_name != "":
                        student["name"] = new_name
                        print("Name updated successfully!")
                    else:
                        print("Name was not changed.")

                elif choice == "2":
                    print("\nCurrent Course:", student["course"])
                    new_course = input("Enter New Course: ")

                    if new_course != "":
                        student["course"] = new_course
                        print("Course updated successfully!")
                    else:
                        print("Course was not changed.")

                elif choice == "3":
                    print("\nCurrent Year Level:", student["year"])
                    new_year = input("Enter New Year Level: ")

                    if new_year != "":
                        student["year"] = new_year
                        print("Year Level updated successfully!")
                    else:
                        print("Year Level was not changed.")

                elif choice == "4":
                    print("\nCurrent Age:", student["age"])
                    new_age = input("Enter New Age: ")

                    if new_age != "":
                        student["age"] = new_age
                        print("Age updated successfully!")
                    else:
                        print("Age was not changed.")

                elif choice == "5":

                        print("\nCurrent GWA:",
                              student.get("gwa", "No grade"))
                        print("Current Remarks:",
                              student.get("remarks", "No grade"))

                        raw = input(
                            "Enter new grades: "
                        )

                        try:
                            grades = [
                                float(x.strip())
                                for x in raw.split(",")
                            ]

                            # Calculate GWA
                            gwa = sum(grades) / len(grades)

                            # Determine remarks
                            if gwa == 1.00:
                                remarks = "Excellent"

                            elif 1.25 <= gwa <= 1.75:
                                remarks = "Very Good"

                            elif 2.00 <= gwa <= 2.50:
                                remarks = "Good/Satisfactory"

                            elif 2.75 <= gwa <= 3.00:
                                remarks = "Passing"

                            elif 3.01 <= gwa <= 4.00:
                                remarks = "Failing/Conditional"

                            elif gwa == 5.00:
                                remarks = "Failed"

                            else:
                                remarks = "Invalid GWA"

                            student["gwa"] = round(gwa, 2)
                            student["remarks"] = remarks

                            print("\nGrades updated successfully!")
                            print(f"GWA: {student['gwa']:.2f}")
                            print(f"Remarks: {student['remarks']}")

                        except:
                            print("Error: Check your grades format.")

                elif choice == "6":
                    print("Update cancelled.")
                    return

                else:
                    print("Invalid choice. Please try again.")

                again = input(
                    "\nDo you want to edit another information? (Y/N): "
                )

                if again.upper() != "Y":
                    print("\nStudent updated successfully!")
                    return

    print("Student not found.")
# ------------------------------------------ 
# COUNT 
# ------------------------------------------ 

def count_student(): 
    print(f"\nTotal Students: {len(students)}")
    
# ------------------------------------------
# DELETE
# ------------------------------------------
def delete_student():
    print("\n===== DELETE STUDENT =====")

    student_id = input("Enter Student ID to delete: ")

    for student in students:
        if student["id"] == student_id:

            print("\nStudent Found:")
            print("Name:", student["name"])

            confirm = input("Are you sure you want to delete? (Y/N): ")

            if confirm.upper() == "Y":
                students.remove(student)
                print("Student deleted successfully!")
            else:
                print("Delete operation cancelled.")

            return

    print("Student not found.")


    ("Student not found.")

# ------------------------------------------
# MAIN MENU
# ------------------------------------------

def main():

    while True:

        print("\n")
        print("=" * 45)
        print("      STUDENT MANAGEMENT SYSTEM")
        print("=" * 45)

        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Count Student")
        print("7. Exit")

        print("=" * 45)

        choice = input("Enter your choice: ")

        if choice == "1":
            add_student()

        elif choice == "2":
            view_students()

        elif choice == "3":
            search_student()

        elif choice == "4":
            update_student()

        elif choice == "5":
            delete_student()
            
        elif choice == "6":    
            count_student()

        elif choice == "7":
            print("\nThank you for using the system!")
            break

        else:
            print("invalid choice.Please try again.")
            

# ------------------------------------------
# RUN PROGRAM
# ------------------------------------------
main()`
        },
        {
            name: "Villaruel, Allyssa Jean J.",
            title: "SIMPLE CRUD SYSTEM",
            description: "Student Management System",
            code: `
# ==========================================
# SIMPLE CRUD SYSTEM
# Student Management System
# Python - GDB Online Compatible
# ==========================================

students = []

# ------------------------------------------
# CREATE
# ------------------------------------------
def add_student():
    print("\n===== ADD STUDENT =====")

    student_id = input("Enter Student ID: ")

    for student in students:
        if student["id"] == student_id:
            print("Error: Student ID already exists.")
            return

    name = input("Enter Student Name: ")
    age = input("Enter Student Age: ")
    sex = input("Enter Sex (M/F)): ")
    course = input("Enter Course: ")
    year = input("Enter Year Level: ")
    number = input("Enter Phone #: ")
    gmail = input("Enter Gmail: ")
    status = input("Enter Student Status: ")

    student = {
        "id": student_id,
        "name": name,
        "age": age,
        "sex": sex,
        "course": course,
        "year": year,
        "number": number,
        "gmail": gmail,
        "status": status
    }

    students.append(student)
    
    print("Student added successfully!")

# ------------------------------------------
# READ - VIEW ALL
# ------------------------------------------
def view_students():
    print("\n===== STUDENT LIST =====")

    if len(students) == 0:
        print("No students found.")
        return

    print("-" * 105)
    print(
        f"{'ID':<10}"
        f"{'NAME':<20}"
        f"{'AGE':<7}"
        f"{'SEX':<7}"
        f"{'COURSE':<10}"
        f"{'YEAR':<7}"
        f"{'PHONE#':<15}"
        f"{'GMAIL':<15}"
        f"{'STATUS':<15}"
    )
    print("-" * 105)

    for student in students:
        print(
            f"{student['id']:<10}"
            f"{student['name']:<20}"
            f"{student['age']:<7}"
            f"{student['sex']:<7}"
            f"{student['course']:<10}"
            f"{student['year']:<7}"
            f"{student['number']:<15}"
            f"{student['gmail']:<15}"
            f"{student['status']:<15}"
        )

    print("-" * 105)


# ------------------------------------------
# READ - SEARCH
# ------------------------------------------
def search_student():
    print("\n===== SEARCH STUDENT =====")

    student_id = input("Enter Student ID: ")

    for student in students:
        if student["id"] == student_id:
            print("\nStudent Found!")
            print("Student ID  :", student["id"])
            print("Name        :", student["name"])
            print("AGE         :", student["age"])
            print("Sex         :", student["sex"])
            print("Course      :", student["course"])
            print("Year Level  :", student["year"])
            print("Phone #     :", student["number"])
            print("Gmail       :", student["gmail"])
            print("Status      :", student["status"])
            return

    print("Student not found.")


# ------------------------------------------
# UPDATE
# ------------------------------------------
def update_student():
    print("\n===== UPDATE STUDENT =====")

    student_id = input("Enter Student ID to update: ")

    for student in students:
        if student["id"] == student_id:

            print("\nCurrent Information:")
            print("Name        :", student["name"])
            print("AGE         :", student["age"])
            print("Sex         :", student["sex"])
            print("Course      :", student["course"])
            print("Year Level  :", student["year"])
            print("Phone #     :", student["number"])
            print("Gmail       :", student["gmail"])
            print("Status      :", student["status"])

            print("\nEnter new information.")
            print("Press ENTER to keep the current value.")

            name = input("Enter Student Name: ")
            age = input("Enter Student Age: ")
            sex = input("Enter Sex (M/F): ")
            course = input("Enter Course: ")
            year = input("Enter Year Level: ")
            number = input("Enter Phone #: ")
            gmail = input("Enter Gmail: ")
            status = input("Enter Student Status: ")


            if name != "":
                student["name"] = name
                
            if age != "":
                student["age"] = age
                
            if sex != "":
                student["sex"] = name

            if course != "":
                student["course"] = course

            if year != "":
                student["year"] = year

            if number != "":
                student["number"] = number

            if gmail != "":
                student["gmail"] = gmail
                
            if status != "":
                student["status"] = status

            print("\nStudent updated successfully!")
            return

    print("Student not found.")

# ------------------------------------------ 
# COUNT 
# ------------------------------------------ 

def count_student(): 
    print(f"\nTotal Students: {len(students)}")

# ------------------------------------------
# DELETE
# ------------------------------------------
def delete_student():
    print("\n===== DELETE STUDENT =====")

    student_id = input("Enter Student ID to delete: ")

    for student in students:
        if student["id"] == student_id:

            print("\nStudent Found:")
            print("Name:", student["name"])

            confirm = input("Are you sure you want to delete? (Y/N): ")

            if confirm.upper() == "Y":
                students.remove(student)
                print("Student deleted successfully!")
            else:
                print("Delete operation cancelled.")

            return

    print("Student not found.")


# ------------------------------------------
# MAIN MENU
# ------------------------------------------
def main():

    while True:

        print("\n")
        print("=" * 45)
        print("      STUDENT MANAGEMENT SYSTEM")
        print("=" * 45)

        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Count Students")
        print("5. Update Student")
        print("6. Delete Student")
        print("7. Exit")

        print("=" * 45)

        choice = input("Enter your choice: ")

        if choice == "1":
            add_student()

        elif choice == "2":
            view_students()

        elif choice == "3":
            search_student()
            
        elif choice == "4": 
            count_student()

        elif choice == "5": 
            update_student()

        elif choice == "6": 
            delete_student()

        elif choice == "7":
            print("\nThank you for using the system!")
            break

        else:
            print("Invalid choice. Please try again.")


# ------------------------------------------
# RUN PROGRAM
# ------------------------------------------
main()`
        }
    ];
    // =====================================
    // 2. SNAKE GAME FUNCTIONS
    // =====================================

    const snakeSections = [
        {
            title: "Game Initialization",
            description: "Canvas, game board, and starting variables.",
            code: `// =====================================
// GAME INITIALIZATION
// =====================================

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

// Board settings
const tile = 20;
const tiles = canvas.width / tile;

// Game colors
const colors = {
    background: "#17121a",
    snake: "#ff4d8d",
    head: "#ff8ab3",
    food: "#ffb6d1",
    grid: "rgba(255,255,255,0.04)"
};

// Starting variables
let snake = [];

let food = {
    x: 8,
    y: 8
};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let gameRunning = false;
let gameOver = false;
let gameTimer = null;

// Starting snake position
snake = [
    { x: 5, y: 8 },
    { x: 4, y: 8 },
    { x: 3, y: 8 }
];`
        },
        {
            title: "Snake Movement",
            description: "Keyboard controls and snake movement.",
            code: `// =====================================
// SNAKE MOVEMENT
// =====================================

function changeDirection(newDirection) {

    // Prevent reversing directly into the snake.
    if (
        newDirection.x === -direction.x &&
        newDirection.y === -direction.y
    ) {
        return;
    }

    nextDirection = newDirection;
}


// Keyboard controls: Arrow Keys and WASD
document.addEventListener("keydown", function (event) {

    if (!modal.classList.contains("snake-open")) return;

    if (!gameRunning) return;

    const key = event.key.toLowerCase();

    const directions = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },

        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },

        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },

        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 }
    };

    if (directions[key]) {
        event.preventDefault();
        changeDirection(directions[key]);
    }

});`
        },
        {
            title: "Food Generation",
            description: "Random food placement and eating mechanics.",
            code: `// =====================================
// FOOD GENERATION
// =====================================

function placeFood() {

    let validPosition = false;

    while (!validPosition) {

        food = {
            x: Math.floor(Math.random() * tiles),
            y: Math.floor(Math.random() * tiles)
        };

        // Make sure food does not overlap the snake.
        validPosition = !snake.some(function (part) {

            return (
                part.x === food.x &&
                part.y === food.y
            );

        });

    }

}


// Check whether the snake eats the food.
const eating =
    head.x === food.x &&
    head.y === food.y;

if (eating) {

    score += 10;

    scoreDisplay.textContent = score;

    // Generate another food item.
    placeFood();

}`
        },
        {
            title: "Scoring System",
            description: "Points, score tracking, and player records.",
            code: `// =====================================
// SCORING SYSTEM
// =====================================

let score = 0;


// Update score when food is eaten.
if (eating) {

    score += 10;

    scoreDisplay.textContent = score;

    placeFood();

}


// Save the player's score when the game ends.
function endGame() {

    stopGame();

    gameOver = true;

    if (
        typeof window.saveSnakePlayerScore === "function"
    ) {

        window.saveSnakePlayerScore(score);

    }

    showMessage(
        "Game Over!",
        "Your score: " + score,
        "Play Again"
    );

    drawGame();

}`
        },
        {
            title: "Player Profiles",
            description: "Adding players and managing saved profiles.",
            code: `// =====================================
// PLAYER PROFILES
// =====================================

const STORAGE_KEY = "ravensTechSnakePlayers";

let players = [];


// Load previously saved players.
try {

    const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (Array.isArray(saved)) {
        players = saved.filter(function (player) {

            return player &&
                typeof player.id === "string" &&
                typeof player.name === "string" &&
                typeof player.bestScore === "number";

        });
    }

} catch (error) {

    console.error("Could not load saved players.", error);

}


// Save players to browser storage.
function persistPlayers() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(players)
        );

        return true;

    } catch (error) {

        console.error("Unable to save players.", error);

        return false;

    }

}


// Add a new player.
function addNewPlayer() {

    const name = nameInput.value.trim();

    if (!name) {
        notice.textContent = "Please enter a player name.";
        return;
    }

    // Prevent duplicate names.
    if (players.some(function (player) {

        return player.name.toLowerCase() === name.toLowerCase();

    })) {

        notice.textContent = "That player name already exists.";
        return;

    }

    const newPlayer = {

        id: (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : String(Date.now()) +
              Math.random().toString(16).slice(2),

        name: name,

        bestScore: 0

    };

    players.push(newPlayer);

    if (!persistPlayers()) {
        players.pop();
        return;
    }

    renderPlayers(newPlayer.id);

    newPlayerForm.hidden = true;

    nameInput.value = "";

    notice.textContent = "Player added successfully!";

}


// Save a player's personal-best score.
window.saveSnakePlayerScore = function (score) {

    const activePlayer = players.find(function (player) {

        return player.id === playerSelect.value;

    });

    if (!activePlayer) {

        notice.textContent =
            "Add or select a player before playing to save scores.";

        return;

    }

    if (score > activePlayer.bestScore) {

        const previousBest = activePlayer.bestScore;

        activePlayer.bestScore = score;

        if (!persistPlayers()) {

            activePlayer.bestScore = previousBest;

            return;

        }

        notice.textContent =
            "New personal best for " + activePlayer.name + "!";

    }

    renderLeaderboard();

};`
        },
        {
            title: "Shared Leaderboard",
            description: "PHP and MySQL leaderboard integration.",
            code: `CREATE TABLE snake_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    best_score INT NOT NULL DEFAULT 0,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

        // =====================================
// COLLISION AND GAME OVER
// =====================================

function gameStep() {

    direction = nextDirection;

    const head = {

        x: snake[0].x + direction.x,

        y: snake[0].y + direction.y

    };


    // Wall collision.
    if (
        head.x < 0 || head.x >= tiles ||
        head.y < 0 || head.y >= tiles
    ) {

        endGame();

        return;

    }


    const eating =
        head.x === food.x &&
        head.y === food.y;


    // Ignore the tail if it will move away.
    const bodyToCheck = eating
        ? snake
        : snake.slice(0, -1);


    // Self-collision detection.
    if (bodyToCheck.some(function (part) {

        return (
            part.x === head.x &&
            part.y === head.y
        );

    })) {

        endGame();

        return;

    }


    // Move the snake.
    snake.unshift(head);


    if (eating) {

        score += 10;

        scoreDisplay.textContent = score;

        placeFood();

    } else {

        snake.pop();

    }


    drawGame();

}


// Stop the game timer.
function stopGame() {

    gameRunning = false;

    if (gameTimer !== null) {

        clearInterval(gameTimer);

        gameTimer = null;

    }

}`
        }
    ];

    // =====================================
    // 3. GENERATE DOCUMENTATION CARDS
    // =====================================

    function createDocumentationCards(items, containerId, type) {
        const container = document.getElementById(containerId);

        if (!container) return;

        container.innerHTML = "";

        items.forEach((item, index) => {

            const card = document.createElement("div");
            card.className = "source-document-card";

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "source-document-toggle";
            toggle.setAttribute("aria-expanded", "false");

            const icon = document.createElement("div");
            icon.className = "source-document-icon";
            icon.textContent = type === "python" ? "🐍" : "🎮";

            const info = document.createElement("div");
            info.className = "source-document-info";

            const category = document.createElement("span");
            category.className = "source-document-category";
            category.textContent = type === "python"
                ? "TEAM MEMBER " + String(index + 1).padStart(2, "0")
                : "GAME FUNCTION " + String(index + 1).padStart(2, "0");

            const heading = document.createElement("h3");
            heading.textContent = item.name || item.title;

            const description = document.createElement("p");
            description.textContent = item.description;

            const arrow = document.createElement("span");
            arrow.className = "source-document-arrow";
            arrow.textContent = "⌄";

            info.append(category, heading, description);
            toggle.append(icon, info, arrow);

            const content = document.createElement("div");
            content.className = "source-document-content";

            const title = document.createElement("h4");
            title.textContent = item.title;

            const pre = document.createElement("pre");
            const code = document.createElement("code");

            // textContent safely displays source code.
            code.textContent = item.code;

            pre.appendChild(code);

            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "source-copy-button";
            copyButton.textContent = "Copy Source Code";

            copyButton.addEventListener("click", async function () {
                try {
                    await navigator.clipboard.writeText(item.code);
                    copyButton.textContent = "Copied!";

                    setTimeout(() => {
                        copyButton.textContent = "Copy Source Code";
                    }, 1500);

                } catch (error) {
                    copyButton.textContent = "Copy unavailable";
                }
            });

            content.append(title, pre, copyButton);

            toggle.addEventListener("click", function () {
                const expanded = card.classList.toggle("expanded");

                toggle.setAttribute(
                    "aria-expanded",
                    String(expanded)
                );
            });

            card.append(toggle, content);
            container.appendChild(card);
        });
    }

    // =====================================
    // 4. POPUP CONTROLS
    // =====================================


function setupPopup(overlayId, cardId, closeSelector, progressId, topId) {

    const overlay = document.getElementById(overlayId);
    const trigger = document.getElementById(cardId);

    if (!overlay || !trigger) return;

    const windowElement = overlay.querySelector(".school-doc-window");
    const closeButton = overlay.querySelector(closeSelector);
    const progress = document.getElementById(progressId);
    const topButton = document.getElementById(topId);

    if (!windowElement || !closeButton) return;

    let previousFocus = null;
    let previousBodyOverflow = "";

    // =====================================
    // READING PROGRESS
    // =====================================

    function updateProgress() {

        if (!progress) return;

        const maxScroll =
            windowElement.scrollHeight -
            windowElement.clientHeight;

        const percentage = maxScroll > 0
            ? (windowElement.scrollTop / maxScroll) * 100
            : 100;

        progress.style.width =
            Math.min(100, percentage) + "%";
    }

    // =====================================
    // REVEAL DOCUMENTATION CARDS
    // =====================================

    function initializeCardAnimations() {

        const cards = overlay.querySelectorAll(
            ".school-doc-item"
        );

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            cards.forEach(function (card) {
                card.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver(

            function (entries, currentObserver) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        currentObserver.unobserve(entry.target);

                    }

                });

            },

            {
                root: windowElement,
                threshold: 0.08
            }

        );

        cards.forEach(function (card) {
            observer.observe(card);
        });

    }

    // =====================================
    // OPEN DOCUMENTATION
    // =====================================

    function openPopup() {

        previousFocus = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        windowElement.scrollTop = 0;

        updateProgress();

        initializeCardAnimations();

        closeButton.focus();

    }

    // =====================================
    // CLOSE DOCUMENTATION
    // =====================================

    function closePopup() {

        if (!overlay.classList.contains("is-open")) {
            return;
        }

        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");

        document.body.style.overflow = previousBodyOverflow;

        if (progress) {
            progress.style.width = "0%";
        }

        if (
            previousFocus &&
            typeof previousFocus.focus === "function"
        ) {

            previousFocus.focus();

        } else {

            trigger.focus();

        }

    }

    // =====================================
    // CLICK AND KEYBOARD CONTROLS
    // =====================================

    trigger.addEventListener("click", openPopup);

    trigger.addEventListener("keydown", function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();
            openPopup();

        }

    });

    closeButton.addEventListener("click", closePopup);

    // Close when clicking outside the window.

    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            closePopup();
        }

    });

    // Close using Escape.

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            overlay.classList.contains("is-open")
        ) {

            closePopup();

        }

    });

    // =====================================
    // SCROLL PROGRESS
    // =====================================

    windowElement.addEventListener("scroll", updateProgress);

    // =====================================
    // BACK TO TOP
    // =====================================

    if (topButton) {

        topButton.addEventListener("click", function () {

            windowElement.scrollTo({

                top: 0,

                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"

            });

        });

    }

}

    // =====================================
    // 5. INITIALIZE
    // =====================================

    function initialize() {

        createDocumentationCards(
            pythonMembers,
            "pythonMemberList",
            "python"
        );

        createDocumentationCards(
            snakeSections,
            "snakeFunctionList",
            "snake"
        );

        setupPopup(
            "pythonDocumentation",
            "pythonProgramsCard",
            "[data-close-python]",
            "pythonProgress",
            "pythonTop"
        );

        setupPopup(
            "snakeDocumentation",
            "snakeDocumentationCard",
            "[data-close-snake]",
            "snakeProgress",
            "snakeTop"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();

/* =========================================
   RAVENSTECH — MEMBER PROFILE POPUPS
   Horizontal cards + individual modals
========================================= */

(function () {

    function initializeMemberProfiles() {

        // Find the existing member education sections.
        const originalSections = Array.from(
            document.querySelectorAll(".education-section")
        );

        const members = [];

        // Collect the existing member information.
        originalSections.forEach(function (section) {

            const profile = section.querySelector(
                ".education-list > .education-item"
            );

            if (!profile) return;

            const summary = profile.querySelector(
                ":scope > summary"
            );

            if (!summary) return;

            const nameElement = summary.querySelector(
                ".education-details h4"
            );

            const roleElement = summary.querySelector(
                ".education-details p"
            );

            const badgeElement = summary.querySelector(
                ".education-date"
            );

            const imageElement = summary.querySelector(
                ".education-icon img"
            );

            const name = nameElement
                ? nameElement.textContent.trim()
                : "Group Member";

            const role = roleElement
                ? roleElement.textContent.trim()
                : "Student";

            const badge = badgeElement
                ? badgeElement.textContent.trim()
                : "Group Member";

            const image = imageElement
                ? imageElement.getAttribute("src")
                : "";

            // Get the three existing expandable sections.
            const informationSections = Array.from(
                profile.children
            ).filter(function (element) {
                return element.tagName === "DETAILS";
            });

            members.push({
                profile: profile,
                name: name,
                role: role,
                badge: badge,
                image: image,
                informationSections: informationSections
            });

        });

        if (members.length === 0) {
            console.warn(
                "Member profiles: No existing profiles were found."
            );
            return;
        }

        // Find the About Us content.
        const aboutContent = document.querySelector(
            "#about .about-content"
        );

        if (!aboutContent) {
            console.warn(
                "Member profiles: About Us section was not found."
            );
            return;
        }

        // Create the horizontal member directory.
        const directory = document.createElement("div");

        directory.className = "member-directory";

        directory.innerHTML = `
            <div class="member-directory-heading">
                <h3>Meet Us</h3>
                <p>
                    Select a member to explore their background,
                    education, and interests.
                </p>
            </div>

            <div class="member-card-row"></div>
        `;

        const cardRow = directory.querySelector(
            ".member-card-row"
        );

        // Add the directory after the About Us content.
        aboutContent.insertAdjacentElement(
            "afterend",
            directory
        );

        // Create a separate popup for each member.
        members.forEach(function (member, index) {

            // =====================================
            // CREATE CLICKABLE MEMBER CARD
            // =====================================

            const card = document.createElement("button");

            card.type = "button";
            card.className = "member-card-trigger";

            card.setAttribute(
                "aria-label",
                "View information about " + member.name
            );

            const imageHTML = member.image
                ? `
                    <div class="member-card-image">
                        <img
                            src="${member.image}"
                            alt="${member.name}"
                            loading="lazy">
                    </div>
                `
                : `
                    <div class="member-card-image">
                        <span>👤</span>
                    </div>
                `;

            card.innerHTML = `
                ${imageHTML}

                <span class="member-card-badge">
                    ${member.badge}
                </span>

                <h4></h4>

                <p></p>

                <span class="member-card-hint">
                    View Profile →
                </span>
            `;

            // Use textContent for member-provided names.
            card.querySelector("h4").textContent = member.name;
            card.querySelector("p").textContent = member.role;

            cardRow.appendChild(card);

            // =====================================
            // CREATE MEMBER POPUP
            // =====================================

            const modal = document.createElement("div");

            modal.className = "member-modal";
            modal.hidden = true;

            modal.setAttribute("aria-hidden", "true");

            const dialog = document.createElement("div");

            dialog.className = "member-modal-dialog";

            dialog.setAttribute("role", "dialog");
            dialog.setAttribute("aria-modal", "true");

            dialog.setAttribute(
                "aria-labelledby",
                "memberModalTitle" + index
            );

            dialog.tabIndex = -1;

            dialog.innerHTML = `
                <div class="member-modal-header">

                    <div>
                        <h2 id="memberModalTitle${index}"></h2>

                        <p>
                            Member Profile | RavensTech
                        </p>
                    </div>

                    <button
                        type="button"
                        class="member-modal-close"
                        aria-label="Close member profile">

                        &times;

                    </button>

                </div>

                <div class="member-modal-body"></div>
            `;

            dialog.querySelector("h2").textContent = member.name;

            modal.appendChild(dialog);

            document.body.appendChild(modal);

            const closeButton = dialog.querySelector(
                ".member-modal-close"
            );

            const modalBody = dialog.querySelector(
                ".member-modal-body"
            );

            // =====================================
            // MOVE EXISTING INFORMATION
            // =====================================

            member.informationSections.forEach(
                function (information, sectionIndex) {

                    information.classList.add(
                        "member-detail-section"
                    );

                    // Display each section's information immediately.
                    information.setAttribute("open", "");

                    modalBody.appendChild(information);

                }
            );

            // =====================================
            // OPEN POPUP
            // =====================================

            function openMemberModal() {

                // Close any other member popup first.
                document.querySelectorAll(
                    ".member-modal.is-open"
                ).forEach(function (otherModal) {

                    otherModal.classList.remove("is-open");
                    otherModal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    otherModal.hidden = true;

                });

                modal.hidden = false;

                requestAnimationFrame(function () {

                    modal.classList.add("is-open");

                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                });

                document.body.classList.add(
                    "member-modal-active"
                );

                document.body.style.overflow = "hidden";

                closeButton.focus();

            }

            // =====================================
            // CLOSE POPUP
            // =====================================

            function closeMemberModal() {

                modal.classList.remove("is-open");

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );

                document.body.classList.remove(
                    "member-modal-active"
                );

                document.body.style.overflow = "";

                setTimeout(function () {

                    if (!modal.classList.contains("is-open")) {
                        modal.hidden = true;
                    }

                }, 300);

                card.focus();

            }
            
            /* =====================================
            CARD CLICK + RIPPLE EFFECT
            ===================================== */

            card.addEventListener("click", function (event) {
                const ripple = document.createElement("span");

                ripple.className = "member-ripple";

                const rect = card.getBoundingClientRect();

                ripple.style.left =
                    (event.clientX - rect.left - 7.5) + "px";

                ripple.style.top =
                    (event.clientY - rect.top - 7.5) + "px";

                card.appendChild(ripple);

                setTimeout(function () {
                    ripple.remove();
                }, 700);

                openMemberModal();

            });

            card.addEventListener("mousemove", function (event) {

                if (window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches) return;

                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform =
                    `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-9px)`;

            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });

            closeButton.addEventListener(
                "click",
                closeMemberModal
            );

            // Close when clicking the dark background.
            modal.addEventListener("click", function (event) {

                if (event.target === modal) {
                    closeMemberModal();
                }

            });

            // Close using the Escape key.
            modal.addEventListener("keydown", function (event) {

                if (event.key === "Escape") {

                    event.preventDefault();

                    closeMemberModal();

                }

            });

        });

        // Remove the old individual education sections.
        // Their information has already been moved to the popups.
        originalSections.forEach(function (section) {

            section.remove();

        });

        console.log(
            members.length + " member profiles initialized."
        );

    }

    // Make sure the page elements are ready.
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeMemberProfiles
        );

    } else {

        initializeMemberProfiles();

    }

})();

/* =========================================
   RAVENSTECH — CUSTOM SCROLLBAR
========================================= */

(function () {

    // Create the custom scrollbar indicator.
    const scrollbar = document.createElement("div");

    scrollbar.id = "ravenScrollbar";

    document.body.appendChild(scrollbar);

    let hideTimer;
    let isHoveringEdge = false;

    const hideDelay = 2000;
    const edgeWidth = 20;

    // Update scrollbar size and position.
    function updateScrollbar() {

        const scrollHeight =
            document.documentElement.scrollHeight;

        const viewportHeight = window.innerHeight;

        const scrollTop = window.scrollY;

        const thumbHeight = Math.max(
            35,
            (viewportHeight / scrollHeight) * viewportHeight
        );

        const maxScroll =
            scrollHeight - viewportHeight;

        const availableTrack =
            viewportHeight - thumbHeight;

        const thumbPosition = maxScroll > 0
            ? (scrollTop / maxScroll) * availableTrack
            : 0;

        scrollbar.style.height = thumbHeight + "px";

        scrollbar.style.transform =
            `translateY(${thumbPosition}px)`;

    }

    // Show the indicator.
    function showScrollbar() {

        updateScrollbar();

        scrollbar.classList.add("visible");

        clearTimeout(hideTimer);

        hideTimer = setTimeout(function () {

            if (!isHoveringEdge) {
                scrollbar.classList.remove("visible");
            }

        }, hideDelay);

    }

    // Detect scrolling.
    window.addEventListener("scroll", function () {

        showScrollbar();

    }, { passive: true });

    // Detect cursor near the right edge.
    document.addEventListener("mousemove", function (event) {

        isHoveringEdge =
            window.innerWidth - event.clientX <= edgeWidth;

        if (isHoveringEdge) {

            showScrollbar();

        } else if (!isHoveringEdge) {

            clearTimeout(hideTimer);

            hideTimer = setTimeout(function () {

                scrollbar.classList.remove("visible");

            }, hideDelay);

        }

    });

    // Update when the browser window changes size.
    window.addEventListener("resize", updateScrollbar);

    // Hide when leaving the browser window.
    document.addEventListener("mouseleave", function () {

        isHoveringEdge = false;

        clearTimeout(hideTimer);

        scrollbar.classList.remove("visible");

    });

    updateScrollbar();

})();

/* =========================================
   RAVENSTECH LOADING SCREEN CONTROLLER
========================================= */

(function () {

    function initializeLoader() {

        const loader = document.getElementById("pageLoader");

        if (!loader) {
            console.error("RavensTech loader not found!");
            return;
        }

        // Make sure the loader starts visible
        loader.style.display = "flex";
        loader.classList.remove("loader-hidden");

        // Keep the animation visible for at least 4 seconds
        const minimumTime = 4000;
        const startTime = Date.now();

        function finishLoading() {

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minimumTime - elapsed);

            setTimeout(function () {

                loader.classList.add("loader-hidden");

                // Wait for the fade-out animation
                setTimeout(function () {
                    loader.remove();
                }, 800);

            }, remaining);
        }

        // Wait until the website finishes loading
        if (document.readyState === "complete") {
            finishLoading();
        } else {
            window.addEventListener("load", finishLoading, {
                once: true
            });
        }

        // Safety fallback: prevent an endless loading screen
        setTimeout(function () {

            if (loader.isConnected) {
                loader.classList.add("loader-hidden");

                setTimeout(function () {
                    loader.remove();
                }, 800);
            }

        }, 10000);
    }

    // Initialize safely
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeLoader, {
            once: true
        });
    } else {
        initializeLoader();
    }

})();
