extern crate cfg_if;
extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;
extern crate fixedbitset;

mod utils;

use std::fmt;
use wasm_bindgen::prelude::*;
use web_sys::console;
use fixedbitset::FixedBitSet;

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
                continue;
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

    // generates a new random board with given width and height
    // every cell has a 'life_chance' chance of being alive
    // at > ~0.7 most will die instantly from overpopulation
    pub fn new_random(width: u32, height: u32, life_chance: f64) -> Universe {
        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, js_sys::Math::random() < life_chance);
        }

        Universe {
            width,
            height,
            cells,
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
        let cells = FixedBitSet::with_capacity((width * height) as usize);
        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn new_blank_default() -> Universe {
        Universe::new_blank(64, 64)
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                next.set(idx, match (cell, live_neighbors) {
                    // Rule 1: Any live cell with < 2 live neighbours dies by underpopulation
                    (true, x) if x < 2 => false,
                    // Rule 2: Any live cell with 2 or 3 live neighbours lives on
                    (true, 2) | (true, 3) => true,
                    // Rule 3: Any live cell with > 3 live neighbours dies by overpopulation
                    (true, x) if x > 3 => false,
                    // Rule 4: Any dead cell with 3 live neighbours becomes alive by reproduction
                    (false, 3) => true,
                    // All other cells remain in the same state.
                    (otherwise, _) => otherwise,
                });
            }
        }

        self.cells = next;
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
}

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}