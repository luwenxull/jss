import { IJSSRule, JSSRule } from './Rule';
import { createSelectorText } from './tool';

export interface IJSSSheet {
  rules: IJSSRule[];
  update(): void;
  attach(parent: HTMLElement, data?: any): void;
}

export class JSSSheet implements IJSSSheet {
  public rules: IJSSRule[] = [];
  constructor() { }

  // TODO:update
  public update() { }

  public attach(parent: HTMLElement, data?: any) {
    let style = document.createElement('style');
    style.innerText = this.createStyleText(data);
    parent.appendChild(style);
    this.linkStyleToRule(style);
  }

  private createStyleText(data?: any): string {
    return this.rules.reduce((text, rule) => {
      return text + rule.translate(data);
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

  static from(data: object, parent: string) {
    // const data = {
    //   container: (data: any) => {
    //     return {
    //       color: data.color,
    //       inherit: {
    //         '& content': {

    //         }
    //       }
    //     };
    //   },
    //   foot: {
    //     color: 'red'
    //   }
    // }
    const sheet = new JSSSheet()
    Object.keys(data).forEach(key => {
      // data[key]
      sheet.rules.push(new JSSRule(createSelectorText(key)))
    })
  }
}
