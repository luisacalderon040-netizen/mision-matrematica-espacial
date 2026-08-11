// ==========================================
// ESTADO Y DATOS DEL JUEGO (LOCALSTORAGE)
// ==========================================

// Definición de las 11 misiones/planetas del juego
const PLANETAS_DATA = [
    { id: 1, name: "Conociendo los números", emoji: "🪐", page: "mission1.html" },
    { id: 2, name: "Explorando el conteo", emoji: "🔴", page: "mission2.html" },
    { id: 3, name: "Comparando planetas", emoji: "🟡", page: "mission3.html" },
    { id: 4, name: "El valor posicional", emoji: "🟢", page: "mission4.html" },
    { id: 5, name: "Comparación y Redondeo", emoji: "🔴", page: "mission5.html" },
    { id: 6, name: "Resta espacial", emoji: "🟣", page: "mission6.html" },
    { id: 7, name: "Multiplicación", emoji: "🟠", page: "mission7.html" },
    { id: 8, name: "División", emoji: "🟤", page: "mission8.html" },
    { id: 9, name: "Medidas y formas", emoji: "⚪", page: "mission9.html" },
    { id: 10, name: "Desafío final", emoji: "🌟", page: "mission10.html" },
    { id: 11, name: "Gran FINAL de Recorrido Galáctico", emoji: "👑", page: "mission11.html" }
];

// Estado por defecto del jugador
const DEFAULT_GAME_STATE = {
    playerName: "Explorador",
    username: "Explorador",
    avatar: "👨‍🚀",
    stars: 0,
    points: 0,
    unlockedMissions: [1], // Al inicio solo la misión 1 está desbloqueada
    completedMissions: []
};

let gameState = { ...DEFAULT_GAME_STATE };

// Cargar estado desde localStorage (soporta MISION_ESPACIAL_DATA y GAME_STATE)
function loadGameState() {
    const savedData = localStorage.getItem("MISION_ESPACIAL_DATA") || localStorage.getItem("GAME_STATE");
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            gameState = { ...DEFAULT_GAME_STATE, ...parsed };
            // Asegurar sincronización de nombre de usuario
            if (parsed.username && !parsed.playerName) gameState.playerName = parsed.username;
            if (parsed.playerName && !parsed.username) gameState.username = parsed.playerName;
        } catch (e) {
            console.error("Error cargando el progreso del juego:", e);
        }
    }
}

// Guardar estado en localStorage (Sincronizado en ambas claves)
function saveGameState() {
    gameState.username = gameState.playerName;
    localStorage.setItem("MISION_ESPACIAL_DATA", JSON.stringify(gameState));
    localStorage.setItem("GAME_STATE", JSON.stringify(gameState));
}

// ==========================================
// RENDERIZADO Y NAVEGACIÓN DE PANTALLAS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadGameState();
    setupUIEvents();
    updateUIElements();
    renderMapPlanets();

    // SI YA COMPLETÓ AL MENOS 1 MISIÓN O HA GANADO ESTRELLAS, IR DIRECTO AL MAPA DE MISIONES
    if (gameState.completedMissions.length > 0 || gameState.stars > 0) {
        mostrarPantallaMapaDirecto();
    }
});

function mostrarPantallaMapaDirecto() {
    const welcomeScreen = document.getElementById("screen-welcome");
    const mapScreen = document.getElementById("screen-map");

    if (welcomeScreen && mapScreen) {
        welcomeScreen.classList.remove("active");
        mapScreen.classList.add("active");
    }
}

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

// Renderiza las tarjetas de los 11 planetas en la rejilla
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
            gameState.username = newName;
            saveGameState();
            updateUIElements();
        });
    }

    // Botón Comenzar Aventura
    const btnStart = document.getElementById("btn-start");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            const inputNameVal = document.getElementById("player-name-input")?.value.trim();
            if (inputNameVal) {
                gameState.playerName = inputNameVal;
                gameState.username = inputNameVal;
                saveGameState();
            }
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
                
                // Regresar a la pantalla de bienvenida al reiniciar
                const welcomeScreen = document.getElementById("screen-welcome");
                const mapScreen = document.getElementById("screen-map");
                if (welcomeScreen && mapScreen) {
                    mapScreen.classList.remove("active");
                    welcomeScreen.classList.add("active");
                }
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
