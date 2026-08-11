// ==========================================
// ESTADO Y DATOS DEL JUEGO (LOCALSTORAGE)
// ==========================================

// Definición de las 10 misiones/planetas del juego
const PLANETAS_DATA = [
    { id: 1, name: "Conociendo los números", emoji: "🪐", page: "mission1.html" },
    { id: 2, name: "Explorando el conteo", emoji: "🔴", page: "mission2.html" },
    { id: 3, name: "Comparando planetas", emoji: "🟡", page: "mission3.html" },
    { id: 4, name: "El valor posicional", emoji: "🟢", page: "mission4.html" },
    { id: 5, name: "Comparación y Redondeo", emoji: "🔴", page: "mission5.html" },
    { id: 6, name: "Resta espacial", emoji: "🟣", page: "mission6.html" },
    { id: 7, name: "Multiplicación", emoji: "🟠", page: "mission7.html" },
    { id: 8, name: "División", emoji: "🟤", page: "#" },
    { id: 9, name: "Medidas y formas", emoji: "⚪", page: "#" },
    { id: 10, name: "Desafío espacial", emoji: "🌟", page: "#" }
];

// Estado por defecto del jugador
const DEFAULT_GAME_STATE = {
    playerName: "Explorador",
    avatar: "👨‍🚀",
    stars: 0,
    points: 0,
    unlockedMissions: [1], // Al inicio solo la misión 1 está desbloqueada
    completedMissions: []
};

let gameState = { ...DEFAULT_GAME_STATE };

// Cargar estado desde localStorage
function loadGameState() {
    const savedData = localStorage.getItem("MISION_ESPACIAL_DATA");
    if (savedData) {
        try {
            gameState = JSON.parse(savedData);
        } catch (e) {
            console.error("Error cargando el progreso del juego:", e);
        }
    }
}

// Guardar estado en localStorage
function saveGameState() {
    localStorage.setItem("MISION_ESPACIAL_DATA", JSON.stringify(gameState));
}

// ==========================================
// RENDERIZADO Y NAVEGACIÓN DE PANTALLAS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadGameState();
    setupUIEvents();
    updateUIElements();
    renderMapPlanets();
});

// Actualiza los textos y contadores en pantalla
function updateUIElements() {
    // Pantalla de Inicio
    const inputName = document.getElementById("player-name-input");
    if (inputName) inputName.value = gameState.playerName;

    const welcomeStars = document.getElementById("welcome-stars");
    if (welcomeStars) welcomeStars.textContent = gameState.stars;

    const welcomePoints = document.getElementById("welcome-points");
    if (welcomePoints) welcomePoints.textContent = gameState.points;

    // Pantalla del Mapa
    const mapName = document.getElementById("map-player-name");
    if (mapName) mapName.textContent = gameState.playerName;

    const mapStars = document.getElementById("map-stars");
    if (mapStars) mapStars.textContent = gameState.stars;

    const mapPoints = document.getElementById("map-points");
    if (mapPoints) mapPoints.textContent = gameState.points;
}

// Renderiza las tarjetas de los 10 planetas en la rejilla
function renderMapPlanets() {
    const container = document.getElementById("planets-container");
    if (!container) return;

    container.innerHTML = "";

    PLANETAS_DATA.forEach(planeta => {
        const isUnlocked = gameState.unlockedMissions.includes(planeta.id);
        const isCompleted = gameState.completedMissions.includes(planeta.id);

        const card = document.createElement("div");
        card.className = `planet-card ${isUnlocked ? "unlocked" : "locked"}`;

        card.innerHTML = `
            <div class="planet-number">Misión ${planeta.id}</div>
            <div class="planet-visual">${planeta.emoji}</div>
            <h3 class="planet-title">${planeta.name}</h3>
            <div class="planet-status-badge">
                ${isUnlocked ? (isCompleted ? "✅ Completada" : "🚀 Disponible") : "🔒 Bloqueado"}
            </div>
        `;

        if (isUnlocked) {
            card.addEventListener("click", () => {
                if (planeta.page && planeta.page !== "#") {
                    window.location.href = planeta.page;
                } else {
                    alert(`La misión "${planeta.name}" estará disponible pronto.`);
                }
            });
        }

        container.appendChild(card);
    });
}

// Configuración de eventos de la interfaz
function setupUIEvents() {
    // Input nombre de jugador
    const inputName = document.getElementById("player-name-input");
    if (inputName) {
        inputName.addEventListener("change", (e) => {
            const newName = e.target.value.trim() || "Explorador";
            gameState.playerName = newName;
            saveGameState();
            updateUIElements();
        });
    }

    // Botón Comenzar Aventura
    const btnStart = document.getElementById("btn-start");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            switchScreen("screen-welcome", "screen-map");
        });
    }

    // Botón Reiniciar Progreso
    const btnReset = document.getElementById("btn-reset-progress");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas reiniciar tu progreso? Volverás a la misión 1.")) {
                gameState = { ...DEFAULT_GAME_STATE };
                saveGameState();
                updateUIElements();
                renderMapPlanets();
            }
        });
    }
}

// Cambia la pantalla visible
function switchScreen(fromId, toId) {
    const currentScreen = document.getElementById(fromId);
    const nextScreen = document.getElementById(toId);

    if (currentScreen && nextScreen) {
        currentScreen.classList.remove("active");
        setTimeout(() => {
            nextScreen.classList.add("active");
        }, 300);
    }
}
