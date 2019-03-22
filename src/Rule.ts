export type JSSStyle = {
  [prop: string]: JSSRuleUnion;
};

export type JSSRuleDescription = {
  [prop: string]: number | string | JSSStyle;
};

export type JSSRuleDescriptionFactory = (data: any) => JSSRuleDescription;

export type JSSRuleUnion = JSSRuleDescription | JSSRuleDescriptionFactory;
export interface IJSSRule {
  selectorText: string;
  ruleText: string;
  rules: JSSRuleUnion;
  inflate(data: any, callback?: (style: JSSStyle) => void): void;
  link(rule: CSSStyleRule): void;
}

export class JSSRule implements IJSSRule {
  private rule: CSSStyleRule | null;
  public ruleText: string;
  constructor(public selectorText: string, public rules: JSSRuleUnion) {
    this.rule = null;
    this.ruleText = '';
  }

  public inflate(data: any, callback?: (style: JSSStyle) => void): void {
    let toBeTranslated: JSSRuleDescription,
      { rules } = this;
    if (typeof rules === 'function') {
      toBeTranslated = rules(data);
    } else {
      toBeTranslated = rules;
    }
    let ruleText = '';
    // 处理翻译结果
    Object.keys(toBeTranslated).forEach(key => {
      // inherit必须是对象
      if (key === 'inherits' && typeof toBeTranslated.inherits === 'object') {
        if (typeof callback === 'function') {
          callback(toBeTranslated.inherits);
        }
      } else {
        ruleText += `${key}:${toBeTranslated[key]}`;
      }
    });
    this.ruleText = this.selectorText + '{' + ruleText + '}';
  }

  public link(rule: CSSStyleRule) {
    this.rule = rule;
  }
}
