extern crate cfg_if;
extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;
extern crate fixedbitset;

mod utils;

use std::fmt;
use wasm_bindgen::prelude::*;
#[cfg(debug_assertions)]
use web_sys::console;
use fixedbitset::FixedBitSet;

#[cfg(debug_assertions)]
macro_rules! log {
    ( $( $t:tt )* ) => {
        console::log_1(&format!( $( $t )* ).into());
    }
}

// based off of https://rustwasm.github.io/docs/book/game-of-life/implementing.html

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == 0 { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            writeln!(f)?;
        }
        Ok(())
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet, // [i * width + j] to index at [i][j]
    #[cfg(debug_assertions)]
    tick: u64,
}

const NEIGHBORS: [(i32, i32); 8] = [
    (-1, -1),
    (-1, 0),
    (-1, 1),
    (0, -1),
    (0, 1),
    (1, -1),
    (1, 0),
    (1, 1),
];

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn reset_width(&mut self, width: u32) {
        self.width = width;
        self.cells = FixedBitSet::with_capacity((self.width * self.height) as usize);
    }

    pub fn reset_height(&mut self, height: u32) {
        self.height = height;
        self.cells = FixedBitSet::with_capacity((self.width * self.height) as usize);
    }

    pub fn get_cells(&self) -> Vec<usize> { // this doesn't feel great but should work
        self.cells.as_slice().to_vec()
    }

    pub fn set_cells(&mut self, cells: &[usize]) {
        self.cells = FixedBitSet::with_capacity((self.width * self.height) as usize);
        for (i, cell) in cells.iter().enumerate() {
            self.cells.set(i, *cell == 1);
        }
    }

    // counts the number of live neighbours of a cell, dead or alive
    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for (dx, dy) in NEIGHBORS {
            // in the tutorial, the universe wraps around, but I want it to expand!!!!!
            // TO INFINITY AND BEYOND!!!! 🚀🚀🚀🚀 (or at least until the memory runs out)
            // so continue if out of bounds
            if (dx < 0 && row == 0) || (dy < 0 && column == 0)
                || (dx > 0 && row >= self.height - 1) || (dy > 0 && column >= self.width - 1) {
                // continue;
                // kill on out of bounds
                count += 3;
            }
            let x = (row as i32 + dx) as u32;
            let y = (column as i32 + dy) as u32;
            if x < self.height && y < self.width {
                let idx = self.get_index(x, y);
                count += self.cells[idx] as u8;
            }
        }
        count
    }

    // toggles a cell
    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, !self.cells[idx]);
    }

    // manifest a cell
    pub fn live_insect(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, true);
    }

    // kills a cell
    pub fn die_insect(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, false);
    }

    // generates a new random board with given width and height
    // every cell has a 'life_chance' chance of being alive
    // at > ~0.7 most will die instantly from overpopulation
    pub fn new_random(width: u32, height: u32, life_chance: f64) -> Universe {
        utils::set_panic_hook();
        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, js_sys::Math::random() < life_chance);
        }

        Universe {
            width,
            height,
            cells,
            #[cfg(debug_assertions)]
            tick: 0,
        }
    }

    // creates a new random universe with 0.25 chance of life
    pub fn new(width: u32, height: u32) -> Universe {
        Universe::new_random(width, height, 0.25)
    }

    // creates a new 384x192 universe with 0.25 chance of life
    // each square is 6x6 pixels
    pub fn new_random_default() -> Universe {
        let width = 384;
        let height = 192;
        let life_chance = 0.25;
        Universe::new_random(width, height, life_chance)
    }

    pub fn new_blank(width: u32, height: u32) -> Universe {
        utils::set_panic_hook();
        let cells = FixedBitSet::with_capacity((width * height) as usize);
        Universe {
            width,
            height,
            cells,
            #[cfg(debug_assertions)]
            tick: 0,
        }
    }

    pub fn new_blank_default() -> Universe {
        Universe::new_blank(64, 64)
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        #[cfg(debug_assertions)]
        let (mut alive_to_dead, mut dead_to_alive) = (Vec::new(), Vec::new());

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                #[cfg(debug_assertions)]
                let before = cell;

                next.set(idx, match (cell, live_neighbors) {
                    // Rule 1: Any live cell with < 2 live neighbours dies by underpopulation
                    (true, 0) | (true, 1) => false,
                    // Rule 2: Any live cell with 2 or 3 live neighbours lives on
                    (true, 2) | (true, 3) => true,
                    // Rule 3: Any live cell with > 3 live neighbours dies by overpopulation
                    (true, x) if x > 3 => false,
                    // Rule 4: Any dead cell with 3 live neighbours becomes alive by reproduction
                    (false, 3) => true,
                    // All other cells remain in the same state.
                    (otherwise, _) => otherwise,
                });

                #[cfg(debug_assertions)]
                if before && !next[idx] {
                    alive_to_dead.push(idx);
                } else if !before && next[idx] {
                    dead_to_alive.push(idx);
                }
            }
        }

        #[cfg(debug_assertions)]
        {
            log!("tick: {}", self.tick);
            if !alive_to_dead.is_empty() || !dead_to_alive.is_empty() {
                log!("alive_to_dead: {:?}", alive_to_dead);
                log!("dead_to_alive: {:?}", dead_to_alive);
            } else {
                log!("no changes");
            }
        }

        self.cells = next;
        #[cfg(debug_assertions)] { // can't debug assertion on expressions, must have own scope
            self.tick += 1;
        }

    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const usize {
        self.cells.as_slice().as_ptr()
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn reset(&mut self) {
        self.cells.clear() // clear all cells by setting to false
    }
    
    pub fn randomize(&mut self, spawn_rate: f64) {
        for i in 0..self.cells.len() {
            self.cells.set(i, js_sys::Math::random() < spawn_rate);
        }
    }

    pub fn spawner(&mut self, pattern: &str, x: u32, y: u32) {
        let pattern: &[(u32, u32)] = match pattern {
            "spaceship" => &SPACESHIP,
            "gun" => &GUN,
            "pulsar" => &PULSAR,
            "beehive" => &BEEHIVE,
            "crab" => &CRAB,
            _ => &SPACESHIP,
        };
        for (i, j) in pattern.iter() {
            let idx = self.get_index(x + i, y + j);
            self.cells.set(idx, true);
        }
    }
}

const SPACESHIP: [(u32, u32); 5] = [
    (1, 2),
    (2, 3),
    (3, 1),
    (3, 2),
    (3, 3),
];

const GUN: [(u32, u32); 36] = [
    (0, 24),
    (1, 22),
    (1, 24),
    (2, 12),
    (2, 13),
    (2, 20),
    (2, 21),
    (2, 34),
    (2, 35),
    (3, 11),
    (3, 15),
    (3, 20),
    (3, 21),
    (3, 34),
    (3, 35),
    (4, 0),
    (4, 1),
    (4, 10),
    (4, 16),
    (4, 20),
    (4, 21),
    (5, 0),
    (5, 1),
    (5, 10),
    (5, 14),
    (5, 16),
    (5, 17),
    (5, 22),
    (5, 24),
    (6, 10),
    (6, 16),
    (6, 24),
    (7, 11),
    (7, 15),
    (8, 12),
    (8, 13),
];

const PULSAR: [(u32, u32); 48] = [
    (2, 4), (2, 5), (2, 6), (2, 10), (2, 11), (2, 12),
    (4, 2), (4, 7), (4, 9), (4, 14),
    (5, 2), (5, 7), (5, 9), (5, 14),
    (6, 2), (6, 7), (6, 9), (6, 14),
    (7, 4), (7, 5), (7, 6), (7, 10), (7, 11), (7, 12),
    (9, 4), (9, 5), (9, 6), (9, 10), (9, 11), (9, 12),
    (10, 2), (10, 7), (10, 9), (10, 14),
    (11, 2), (11, 7), (11, 9), (11, 14),
    (12, 2), (12, 7), (12, 9), (12, 14),
    (14, 4), (14, 5), (14, 6), (14, 10), (14, 11), (14, 12),
];

const BEEHIVE: [(u32, u32); 6] = [
    (2, 3), (2, 4),
    (3, 2), (3, 5),
    (4, 3), (4, 4),
];

const CRAB: [(u32, u32); 25] = [
    (0, 8), (0, 9),
    (1, 7), (1, 8),
    (2, 9),
    (3, 11), (3, 12),
    (4, 10),
    (6, 9), (6, 12),
    (7, 1), (7, 2), (7, 8), (7, 9),
    (8, 0), (8, 1), (8, 7),
    (9, 2), (9, 7), (9, 9),
    (10, 4), (10, 5), (10, 8),
    (11, 4), (11, 5)
];

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}