import JSSRule, { JSSStyle } from './Rule';

export interface IJSSSheetStyles {
  [prop: string]: JSSStyle;
}

export interface IJSSClasses {
  [prop: string]: string;
}

export class JSSSheet<T> {
  public rules: JSSRule[] = [];
  public classes: IJSSClasses = {};
  // 根据rule.selector做映射
  private rulesDict: { [prop: string]: JSSRule } = {};
  private $style?: HTMLStyleElement;
  private changeListeners: Array<(classes: IJSSClasses) => void> = [];
  constructor(
    public factory: (data: T) => IJSSSheetStyles,
    public namespace: string
  ) {}

  public inflate(data: T): this {
    const styles = this.factory(data);
    Object.keys(styles).forEach(key => {
      new JSSRule(
        key,
        styles[key],
        {
          namespace: this.namespace
        },
        this.registerRule.bind(this)
      );
    });
    return this;
  }

  public replace(data: T): this {
    if (this.$style) {
      this.rules = [];
      this.classes = {};
      this.rulesDict = {};
      const styles = this.factory(data);
      Object.keys(styles).forEach(key => {
        new JSSRule(
          key,
          styles[key],
          {
            namespace: this.namespace
          },
          this.registerRule.bind(this)
        );
      });
      this.$style.innerHTML = this.getCssText();
      this.changeListeners.forEach(fn => fn(this.classes));
    } else {
      throw new Error('call attach before replace!');
    }
    return this;
  }

  public attach(): this {
    const style = document.createElement('style');
    // style.type = 'text/css'
    style.innerHTML = this.getCssText();
    // todo
    this.$style = style;
    document.getElementsByTagName('head')[0].appendChild(style);
    this.analyze();
    return this;
  }

  public remove(): this {
    if (this.$style) {
      document.getElementsByTagName('head')[0].removeChild(this.$style);
    }
    return this;
  }

  public onChange(fn: (classes: IJSSClasses) => void): this {
    this.changeListeners.push(fn);
    return this;
  }

  public offChange(fn: (classes: IJSSClasses) => void): this {
    this.changeListeners = this.changeListeners.filter(item => item !== fn);
    return this;
  }

  private getCssText() {
    let innerHTML = '';
    this.rules.forEach(rule => {
      innerHTML += `${rule.selector}{${rule.ruleText}}`;
    });
    return innerHTML;
  }

  private registerRule(rule: JSSRule) {
    this.rules.push(rule);
    this.classes[rule.key] = rule.className;
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
      const { sheet } = this.$style;
      if (sheet instanceof CSSStyleSheet) {
        for (let rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule) {
            if (this.rulesDict[rule.selectorText]) {
              this.rulesDict[rule.selectorText].bindTo(rule);
            }
          }
        }
      }
    }
  }
}

export default function createSheet<T>(
  factory: (data: T) => IJSSSheetStyles,
  namespace: string = ''
) {
  return new JSSSheet(factory, namespace);
}
