'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Rule_1 = require('./Rule');
const tool_1 = require('./tool');
class Sheet {
  constructor(style, data = null) {
    this.rules = [];
    this.classes = {};
    this.translateStyle(style, data, '');
  }
  update(data) {
    this.rules.forEach(rule => {
      rule.update(data);
    });
  }
  attach(parent) {
    const innerText = this.rules.reduce((acc, rule) => {
      return acc + rule.ruleText;
    }, '');
    let style = document.createElement('style');
    style.innerText = innerText;
    parent.appendChild(style);
    this.linkStyleToRule(style);
  }
  linkStyleToRule(style) {
    if (style.sheet) {
      const rules = style.sheet.cssRules;
      for (let i = 0; i < rules.length; i++) {
        this.rules[i].link(rules[i]);
      }
    }
  }
  translateStyle(style, data, parentSelector) {
    Object.keys(style).forEach(key => {
      const className = tool_1.createSelectorText(key, parentSelector);
      const rule = new Rule_1.JSSRule(className, style[key]);
      this.rules.push(rule);
      rule.inflate(data, innerStyle => {
        this.translateStyle(innerStyle, data, rule.selectorText);
      }); // 规则数据填充
    });
  }
}
exports.default = Sheet;
