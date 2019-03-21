import { JSSSheetManager } from './SheetManager'
import { JSSStyleRule, JSSStyleRuleFactory } from './SheetRule'

interface JSSSheet {
  [prop: string]: JSSStyleRule | JSSStyleRuleFactory
}

const data: JSSSheet = {
  container: (data: any) => {
    return {
      color: data.color
    }
  },
  foot: {
    color: 'red',
  }
}

let index = 1

function createSelectorText() {
  return 'a' + index++
}

function createStyleRule(data: JSSStyleRule | JSSStyleRuleFactory) {
  if (typeof data === 'function') {
    
  }
  return data
}

export function createStyleSheet(sheet: JSSSheet) {
  const manager: JSSSheetManager = new JSSSheetManager()
  Object.keys(sheet).forEach(key => {
    manager.selectors[key] = {
      selectorText: createSelectorText(),
      rule: sheet[key]
    }
  })
}