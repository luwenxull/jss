import { IJSSRule, JSSRule, JSSStyle } from './Rule';
import { createSelectorText } from './tool';
export interface IJSSSheet {
  update(data: any): void;
  attach(parent: HTMLElement): void;
}
export default class Sheet implements IJSSSheet {
  private rules: IJSSRule[];
  private classes: {
    [prop: string]: string
  };
  constructor(style: JSSStyle, data: any = null) {
    this.rules = [];
    this.classes = {};
    this.translateStyle(style, data, '');
  }

  public update(data:any): void {
    this.rules.forEach(rule => {
      rule.update(data)
    })
  }

  public attach(parent: HTMLElement): void {
    const innerText = this.rules.reduce((acc, rule) => {
      return acc + rule.ruleText
    }, '')
    let style = document.createElement('style');
    style.innerText = innerText;
    parent.appendChild(style);
    this.linkStyleToRule(style);
  }

  private linkStyleToRule(style: HTMLStyleElement): void {
    if (style.sheet) {
      const rules = (style.sheet as CSSStyleSheet).cssRules;
      for (let i = 0; i < rules.length; i++) {
        this.rules[i].link(rules[i] as CSSStyleRule);
      }
    }
  }

  private translateStyle(style: JSSStyle, data: any, parentSelector: string):void {
    Object.keys(style).forEach(key => {
      const className = createSelectorText(key, parentSelector);
      const rule = new JSSRule(className, style[key]);
      this.rules.push(rule);
      rule.inflate(data, (innerStyle: JSSStyle) => {
        this.translateStyle(innerStyle, data, rule.selectorText);
      }); // 规则数据填充
    });
  }
}
