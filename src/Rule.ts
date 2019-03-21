export interface IJSSRuleStyle {
  [prop: string]: any;
}

export interface IJSSRuleStyleFactory {
  (data: any): IJSSRuleStyle;
}

export interface IJSSRule {
  selectorText: string;
  style: IJSSRuleStyle | IJSSRuleStyleFactory;
  translate(data?: any): string;
  link(rule: CSSStyleRule): void;
}

export class JSSRule implements IJSSRule {
  private rule: CSSStyleRule | null = null;
  constructor(
    public selectorText: string,
    public style: IJSSRuleStyle | IJSSRuleStyleFactory
  ) {}

  public translate(data: any) {
    let toBeTranslated: IJSSRuleStyle;
    if (typeof this.style === 'function') {
      toBeTranslated = this.style(data);
    } else {
      toBeTranslated = this.style;
    }
    let str = '';
    Object.keys(toBeTranslated).forEach(key => {
      // inherit必须是对象
      if (key === 'inherit' && typeof toBeTranslated.inherit === 'object') {
        Object.keys(toBeTranslated.inherit).forEach(key2 => {
          this.createDerivedRule(key2, toBeTranslated.inherit[key2])
        })
      }
      str += `${key}:${toBeTranslated[key]}`;
    });
    return this.selectorText + str;
  }

  public link(rule: CSSStyleRule) {
    this.rule = rule;
  }

  private createDerivedRule(key: string, style: IJSSRuleStyle | IJSSRuleStyleFactory) {

  }
}
