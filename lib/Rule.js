'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class JSSRule {
  constructor(selectorText, rules) {
    this.selectorText = selectorText;
    this.rules = rules;
    this.rule = null;
    this.ruleText = '';
  }
  inflate(data, callback) {
    let toBeTranslated,
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
  link(rule) {
    this.rule = rule;
  }
}
exports.JSSRule = JSSRule;
