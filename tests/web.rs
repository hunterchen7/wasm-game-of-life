//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate wasm_game_of_life;
use wasm_game_of_life::Universe;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

const SPACESHIP_TICK1: [(u32, u32); 5] = [
    (1, 2),
    (2, 3),
    (3, 1),
    (3, 2),
    (3, 3),
];

const SPACESHIP_TICK2: [(u32, u32); 5] = [
    (2, 1),
    (2, 3),
    (3, 2),
    (3, 3),
    (4, 2),
];

fn tuple_arr_to_1d(width: u32, arr: &[(u32, u32)]) -> Vec<usize> {
    let mut vec = vec![0; (width * width) as usize];
    for (i, j) in arr.iter() {
        vec[(i * width + j) as usize] = 1;
    }
    vec
}

#[cfg(test)]
pub fn input_spaceship() -> Universe {
    let mut universe = Universe::new_blank_default();
    universe.reset_width(6);
    universe.reset_height(6);
    universe.set_cells(&tuple_arr_to_1d(6, &SPACESHIP_TICK1));
    universe
}

#[cfg(test)]
pub fn expected_spaceship() -> Universe {
    let mut universe = Universe::new_blank_default();
    universe.reset_width(6);
    universe.reset_height(6);
    universe.set_cells(&tuple_arr_to_1d(6, &SPACESHIP_TICK2));
    universe
}

#[wasm_bindgen_test]
pub fn test_tick() {
    // Let's create a smaller Universe with a small spaceship to test!
    let mut input_universe = input_spaceship();

    // This is what our spaceship should look like
    // after one tick in our universe.
    let expected_universe = expected_spaceship();

    //// Call `tick` and then see if the cells in the `Universe`s are the same.
    input_universe.tick();
    assert_eq!(&input_universe.get_cells(), &expected_universe.get_cells());
}