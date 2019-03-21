export interface IJSSRuleStyle {
  [prop: string]: string | number
}

export interface IJSSRuleStyleFactory {
  (data: any): IJSSRuleStyle
}

export interface IJSSRule {
  selectorText: string,
  style: IJSSRuleStyle | IJSSRuleStyleFactory
  translate(data?: any): string
}

export class JSSRule implements IJSSRule {
  constructor(public selectorText: string, public style: IJSSRuleStyle | IJSSRuleStyleFactory) {
  }

  public translate(data: any) {
    let toBeTranslated: IJSSRuleStyle
    if (typeof this.style === 'function') {
      toBeTranslated = this.style(data)
    } else {
      toBeTranslated = this.style
    }
    let str = ''
    Object.keys(toBeTranslated).forEach(key => {
      str += `${key}:${toBeTranslated[key]}`
    })
    return str
  }
}
