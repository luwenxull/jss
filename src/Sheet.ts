import JSSRule, { JSSStyle } from './Rule';

export interface IJSSSheetStyles {
  [prop: string]: JSSStyle;
}

export interface IJSSClasses {
  [prop: string]: string
}

export class JSSSheet<T> {
  public rules: JSSRule[] = [];
  public classes: IJSSClasses= {};
  // 根据rule.selector做映射
  private rulesDict: {[prop: string]: JSSRule} = {};
  private $style?: HTMLStyleElement;
  constructor(public factory: (data: T) => IJSSSheetStyles) {}

  public inflate(data: T): this {
    const styles = this.factory(data);
    Object.keys(styles).forEach(key => {
      new JSSRule(key, styles[key], {}, this.registerRule.bind(this));
    });
    return this
  }

  public update(data: T) {

  }

  public attach() {
    const style = document.createElement('style')
    let innerHTML = ''
    this.rules.forEach(rule => {
      innerHTML += `${rule.selector}{${rule.ruleText}}`
    })
    // style.type = 'text/css'
    style.innerHTML = innerHTML
    // todo
    this.$style = style
    document.getElementsByTagName('head')[0].appendChild(style)
    this.analyze()
    return this
  }

  public remove() {
    if (this.$style) {
      document.getElementsByTagName('head')[0].removeChild(this.$style)
    }
    return this
  }

  private registerRule(rule: JSSRule) {
    this.rules.push(rule);
    this.classes[rule.key] = rule.selfSelector;
    this.rulesDict[rule.selector] = rule;
  }

  /**
   * 构建rule和真实rule的联系
   *
   * @private
   * @memberof JSSSheet
   */
  private analyze() {
    if (this.$style) {
      const { sheet } = this.$style
      if (sheet instanceof CSSStyleSheet) {
        for(let rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule) {
            if (this.rulesDict[rule.selectorText]) {
              this.rulesDict[rule.selectorText].bindTo(rule)
            }
          }
        }
      }
    }
  }
}

export default function createSheet<T>(factory: (data: T) => IJSSSheetStyles) {
  return new JSSSheet(factory);
}
