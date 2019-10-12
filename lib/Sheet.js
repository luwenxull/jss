import JSSRule from './Rule';
export class JSSSheet {
  constructor(factory, namespace) {
    this.factory = factory;
    this.namespace = namespace;
    this.rules = [];
    this.classes = {};
    // 根据rule.selector做映射
    this.rulesDict = {};
    this.changeListeners = [];
  }
  inflate(data) {
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
  replace(data) {
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
  attach() {
    const style = document.createElement('style');
    // style.type = 'text/css'
    style.innerHTML = this.getCssText();
    // todo
    this.$style = style;
    document.getElementsByTagName('head')[0].appendChild(style);
    this.analyze();
    return this;
  }
  remove() {
    if (this.$style) {
      document.getElementsByTagName('head')[0].removeChild(this.$style);
    }
    return this;
  }
  onChange(fn) {
    this.changeListeners.push(fn);
    return this;
  }
  offChange(fn) {
    this.changeListeners = this.changeListeners.filter(item => item !== fn);
    return this;
  }
  getCssText() {
    let innerHTML = '';
    this.rules.forEach(rule => {
      innerHTML += `${rule.selector}{${rule.ruleText}}`;
    });
    return innerHTML;
  }
  registerRule(rule) {
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
  analyze() {
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
export default function createSheet(factory, namespace = '') {
  return new JSSSheet(factory, namespace);
}
