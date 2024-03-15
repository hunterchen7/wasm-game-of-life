import { Universe, Cell, wasm_memory } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

const CELL_SIZE = 9; // px
const GRID_COLOR = "#161719";
const DEAD_COLOR = "#555455";
const ALIVE_COLOR = "#C097F0";

// Construct the universe, and get its width and height.
let w = window.innerWidth / CELL_SIZE;
let h = window.innerHeight / CELL_SIZE;
let spawn_rate = 0.5;
const universe = Universe.new_random(w, h, spawn_rate);
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

let ticks = 0;

const tick = () => {
    ticks += 1;
    updateTicks();
    universe.tick();

    drawGrid();
    drawCells();
}

let animationId = null;
let timeoutId = null;

const renderLoop = () => {
    const timeBetween = document.getElementById("time-between").value;

    timeoutId = setTimeout(() => {
        debugger;
        tick();
        animationId = requestAnimationFrame(renderLoop);
    }, timeBetween);
};

// updated by pause/play actions from button or space bar
const isPaused = () => {
    return animationId === null;
}

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);

    ctx.beginPath();

    const bitIsSet = (n, arr) => {
        const byte = Math.floor(n / 8);
        const mask = 1 << (n % 8);
        return (arr[byte] & mask) === mask;
    };

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

// click to toggle cells when paused
canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    if (animationId === null) { // only allow toggle cells if the game is paused
        universe.toggle_cell(row, col);
        drawGrid();
        drawCells();
    }
});

// space bar to pause/play
document.body.onkeyup = function(e) {
    if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
        if (isPaused()) {
            play();
        } else {
            pause();
        }
    }
}

// play/pause buttons
const playPauseButton = document.getElementById("play-pause");
const play = () => {
    playPauseButton.textContent = "pause";
    renderLoop();
};

const pause = () => {
    playPauseButton.textContent = "play";
    cancelAnimationFrame(animationId);
    clearTimeout(timeoutId);
    animationId = null;
}

playPauseButton.addEventListener("click", event => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

// reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", event => {
    ticks = 0;
    universe.reset();
    drawGrid();
    drawCells();
});

// randomize button
const randomizeButton = document.getElementById("randomize");

randomizeButton.addEventListener("click", event => {
    const spawnInput = document.getElementById("spawn-rate");
    const spawnRate = spawnInput.value;
    console.log('spawn rate: ', spawnRate);
    ticks = 0;
    universe.randomize(spawnRate / 100);
    drawGrid();
    drawCells();
});

// step button
const stepButton = document.getElementById("step");
stepButton.addEventListener("click", event => {
    tick();
    drawGrid();
    drawCells();
});

// update ticks
const tickDisplay = document.getElementById("ticks");
const updateTicks = () => {
    tickDisplay.textContent = `total ticks: ${ticks}`;
}

drawGrid();
drawCells();
play();