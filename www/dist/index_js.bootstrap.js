"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcreate_wasm_app"] = self["webpackChunkcreate_wasm_app"] || []).push([["index_js"],{

/***/ "../pkg/wasm_game_of_life.js":
/*!***********************************!*\
  !*** ../pkg/wasm_game_of_life.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Cell: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.Cell),\n/* harmony export */   Universe: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.Universe),\n/* harmony export */   __wbg_random_26e2d782b541ca6b: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_random_26e2d782b541ca6b),\n/* harmony export */   __wbg_set_wasm: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_set_wasm),\n/* harmony export */   __wbindgen_memory: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_memory),\n/* harmony export */   __wbindgen_throw: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_throw),\n/* harmony export */   wasm_memory: () => (/* reexport safe */ _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.wasm_memory)\n/* harmony export */ });\n/* harmony import */ var _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wasm_game_of_life_bg.wasm */ \"../pkg/wasm_game_of_life_bg.wasm\");\n/* harmony import */ var _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm_game_of_life_bg.js */ \"../pkg/wasm_game_of_life_bg.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);\n_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n(0,_wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_set_wasm)(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__);\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://create-wasm-app/../pkg/wasm_game_of_life.js?");

/***/ }),

/***/ "../pkg/wasm_game_of_life_bg.js":
/*!**************************************!*\
  !*** ../pkg/wasm_game_of_life_bg.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Cell: () => (/* binding */ Cell),\n/* harmony export */   Universe: () => (/* binding */ Universe),\n/* harmony export */   __wbg_random_26e2d782b541ca6b: () => (/* binding */ __wbg_random_26e2d782b541ca6b),\n/* harmony export */   __wbg_set_wasm: () => (/* binding */ __wbg_set_wasm),\n/* harmony export */   __wbindgen_memory: () => (/* binding */ __wbindgen_memory),\n/* harmony export */   __wbindgen_throw: () => (/* binding */ __wbindgen_throw),\n/* harmony export */   wasm_memory: () => (/* binding */ wasm_memory)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\nlet wasm;\nfunction __wbg_set_wasm(val) {\n    wasm = val;\n}\n\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachedUint8Memory0 = null;\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nconst heap = new Array(128).fill(undefined);\n\nheap.push(undefined, null, true, false);\n\nlet heap_next = heap.length;\n\nfunction addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n\n    heap[idx] = obj;\n    return idx;\n}\n\nlet cachedInt32Memory0 = null;\n\nfunction getInt32Memory0() {\n    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {\n        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);\n    }\n    return cachedInt32Memory0;\n}\n\nfunction getObject(idx) { return heap[idx]; }\n\nfunction dropObject(idx) {\n    if (idx < 132) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n}\n\nfunction takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n}\n/**\n* @returns {any}\n*/\nfunction wasm_memory() {\n    const ret = wasm.wasm_memory();\n    return takeObject(ret);\n}\n\nfunction notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }\n/**\n*/\nconst Cell = Object.freeze({ Dead:0,\"0\":\"Dead\",Alive:1,\"1\":\"Alive\", });\n\nconst UniverseFinalization = (typeof FinalizationRegistry === 'undefined')\n    ? { register: () => {}, unregister: () => {} }\n    : new FinalizationRegistry(ptr => wasm.__wbg_universe_free(ptr >>> 0));\n/**\n*/\nclass Universe {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(Universe.prototype);\n        obj.__wbg_ptr = ptr;\n        UniverseFinalization.register(obj, obj.__wbg_ptr, obj);\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n        UniverseFinalization.unregister(this);\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_universe_free(ptr);\n    }\n    /**\n    * @param {number} width\n    * @param {number} height\n    * @param {number} life_chance\n    * @returns {Universe}\n    */\n    static new_random(width, height, life_chance) {\n        const ret = wasm.universe_new_random(width, height, life_chance);\n        return Universe.__wrap(ret);\n    }\n    /**\n    * @param {number} width\n    * @param {number} height\n    * @returns {Universe}\n    */\n    static new(width, height) {\n        const ret = wasm.universe_new(width, height);\n        return Universe.__wrap(ret);\n    }\n    /**\n    * @returns {Universe}\n    */\n    static new_random_default() {\n        const ret = wasm.universe_new_random_default();\n        return Universe.__wrap(ret);\n    }\n    /**\n    */\n    tick() {\n        wasm.universe_tick(this.__wbg_ptr);\n    }\n    /**\n    * @returns {number}\n    */\n    width() {\n        const ret = wasm.universe_width(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    height() {\n        const ret = wasm.universe_height(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    cells() {\n        const ret = wasm.universe_cells(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {string}\n    */\n    render() {\n        let deferred1_0;\n        let deferred1_1;\n        try {\n            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n            wasm.universe_render(retptr, this.__wbg_ptr);\n            var r0 = getInt32Memory0()[retptr / 4 + 0];\n            var r1 = getInt32Memory0()[retptr / 4 + 1];\n            deferred1_0 = r0;\n            deferred1_1 = r1;\n            return getStringFromWasm0(r0, r1);\n        } finally {\n            wasm.__wbindgen_add_to_stack_pointer(16);\n            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);\n        }\n    }\n}\n\nconst __wbg_random_26e2d782b541ca6b = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');\n\nfunction __wbindgen_throw(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\nfunction __wbindgen_memory() {\n    const ret = wasm.memory;\n    return addHeapObject(ret);\n};\n\n\n\n//# sourceURL=webpack://create-wasm-app/../pkg/wasm_game_of_life_bg.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wasm-game-of-life */ \"../pkg/wasm_game_of_life.js\");\n/* harmony import */ var wasm_game_of_life_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wasm-game-of-life/wasm_game_of_life_bg.wasm */ \"../pkg/wasm_game_of_life_bg.wasm\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__, wasm_game_of_life_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);\n([wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__, wasm_game_of_life_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\r\n\r\n\r\nconst CELL_SIZE = 5; // px\r\nconst GRID_COLOR = \"#161719\";\r\nconst DEAD_COLOR = \"#555455\";\r\nconst ALIVE_COLOR = \"#C097F0\";\r\n\r\n// Construct the universe, and get its width and height.\r\nlet w = 384;\r\nlet h = 384;\r\nlet spawn_rate = 0.5;\r\nconst universe = wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__.Universe.new_random(w, h, spawn_rate);\r\nconst width = universe.width();\r\nconst height = universe.height();\r\n\r\n// Give the canvas room for all of our cells and a 1px border\r\n// around each of them.\r\nconst canvas = document.getElementById(\"game-of-life-canvas\");\r\ncanvas.height = (CELL_SIZE + 1) * height + 1;\r\ncanvas.width = (CELL_SIZE + 1) * width + 1;\r\n\r\nconst ctx = canvas.getContext('2d');\r\n\r\nconst renderLoop = () => {\r\n    universe.tick();\r\n\r\n    drawGrid();\r\n    drawCells();\r\n\r\n    requestAnimationFrame(renderLoop);\r\n};\r\n\r\nconst drawGrid = () => {\r\n    ctx.beginPath();\r\n    ctx.strokeStyle = GRID_COLOR;\r\n\r\n    // Vertical lines.\r\n    for (let i = 0; i <= width; i++) {\r\n        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);\r\n        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);\r\n    }\r\n\r\n    // Horizontal lines.\r\n    for (let j = 0; j <= height; j++) {\r\n        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);\r\n        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);\r\n    }\r\n\r\n    ctx.stroke();\r\n};\r\n\r\nconst getIndex = (row, column) => {\r\n    return row * width + column;\r\n};\r\n\r\nconst drawCells = () => {\r\n    const cellsPtr = universe.cells();\r\n    const cells = new Uint8Array(wasm_game_of_life_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_1__.memory.buffer, cellsPtr, width * height / 8);\r\n\r\n    ctx.beginPath();\r\n\r\n    const bitIsSet = (n, arr) => {\r\n        const byte = Math.floor(n / 8);\r\n        const mask = 1 << (n % 8);\r\n        return (arr[byte] & mask) === mask;\r\n    };\r\n\r\n    for (let row = 0; row < height; row++) {\r\n        for (let col = 0; col < width; col++) {\r\n            const idx = getIndex(row, col);\r\n\r\n            ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;\r\n\r\n            ctx.fillRect(\r\n                col * (CELL_SIZE + 1) + 1,\r\n                row * (CELL_SIZE + 1) + 1,\r\n                CELL_SIZE,\r\n                CELL_SIZE\r\n            );\r\n        }\r\n    }\r\n\r\n    ctx.stroke();\r\n};\r\n\r\ndrawGrid();\r\ndrawCells();\r\nrequestAnimationFrame(renderLoop);\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://create-wasm-app/./index.js?");

/***/ }),

/***/ "../pkg/wasm_game_of_life_bg.wasm":
/*!****************************************!*\
  !*** ../pkg/wasm_game_of_life_bg.wasm ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(/*! ./wasm_game_of_life_bg.js */ \"../pkg/wasm_game_of_life_bg.js\");\nmodule.exports = __webpack_require__.v(exports, module.id, \"e5f1cac6cc22d1aa1f29\", {\n\t\"./wasm_game_of_life_bg.js\": {\n\t\t\"__wbg_random_26e2d782b541ca6b\": WEBPACK_IMPORTED_MODULE_0.__wbg_random_26e2d782b541ca6b,\n\t\t\"__wbindgen_throw\": WEBPACK_IMPORTED_MODULE_0.__wbindgen_throw,\n\t\t\"__wbindgen_memory\": WEBPACK_IMPORTED_MODULE_0.__wbindgen_memory\n\t}\n});\n\n//# sourceURL=webpack://create-wasm-app/../pkg/wasm_game_of_life_bg.wasm?");

/***/ })

}]);