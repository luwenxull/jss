export function createSelectorText(text: string, parent: string): string {
  return text.replace('&', parent);
}

export function camelToSnake(str: string) {
  return str.split(/(?=[A-Z])/).join('-').toLocaleLowerCase()
}
