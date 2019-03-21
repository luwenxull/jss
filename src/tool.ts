export function createSelectorText(text: string, parent: string): string {
  return text.replace('&', parent)
}