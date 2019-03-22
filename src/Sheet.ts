import { IJSSRule, JSSRule, JSSStyle } from './Rule';
import { createSelectorText } from './tool';
export interface IJSSSheet {
  rules: IJSSRule[];
  update(): void;
  attach(parent: HTMLElement, data?: any): void;
}
export class Sheet implements IJSSSheet {
  public rules: IJSSRule[];
  private classes: object;
  constructor(style: JSSStyle, data: any = null) {
    this.rules = [];
    this.classes = {};
    this.translateStyle(style, data, '');
  }

  public update() {}

  public attach(parent: HTMLElement, data?: any) {
    let style = document.createElement('style');
    style.innerText = this.createStyleText(data);
    parent.appendChild(style);
    this.linkStyleToRule(style);
  }

  private createStyleText(data?: any): string {
    return this.rules.reduce((text, rule) => {
      return text + rule.inflate(data);
    }, ',');
  }

  private linkStyleToRule(style: HTMLStyleElement) {
    if (style.sheet) {
      const rules = (style.sheet as CSSStyleSheet).cssRules;
      for (let i = 0; i < rules.length; i++) {
        this.rules[i].link(rules[i] as CSSStyleRule);
      }
    }
  }

  private translateStyle(style: JSSStyle, data: any, parentSelector: string) {
    Object.keys(style).forEach(key => {
      const className = createSelectorText(key, parentSelector);
      // this.classes[key] =
      const rule = new JSSRule(className, style[key]);
      this.rules.push(rule);
      rule.inflate(data, (innerStyle: JSSStyle) => {
        this.translateStyle(innerStyle, data, rule.selectorText);
      }); // 规则数据填充
    });
  }
}
