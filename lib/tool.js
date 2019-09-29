"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createSelectorText(text, parent) {
    return text.replace('&', parent);
}
exports.createSelectorText = createSelectorText;
function camelToSnake(str) {
    return str
        .split(/(?=[A-Z])/)
        .join('-')
        .toLocaleLowerCase();
}
exports.camelToSnake = camelToSnake;
