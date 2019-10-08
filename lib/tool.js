export function createSelectorText(text, parent) {
  return text.replace('&', parent);
}
export function camelToSnake(str) {
  return str
    .split(/(?=[A-Z])/)
    .join('-')
    .toLocaleLowerCase();
}
