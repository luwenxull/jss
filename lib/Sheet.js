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
  update() {}
  attach(parent, data) {
    let style = document.createElement('style');
    style.innerText = this.createStyleText(data);
    parent.appendChild(style);
    this.linkStyleToRule(style);
  }
  createStyleText(data) {
    return this.rules.reduce((text, rule) => {
      return text + rule.inflate(data);
    }, ',');
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
      // this.classes[key] =
      const rule = new Rule_1.JSSRule(className, style[key]);
      this.rules.push(rule);
      rule.inflate(data, innerStyle => {
        this.translateStyle(innerStyle, data, rule.selectorText);
      }); // 规则数据填充
    });
  }
}
exports.Sheet = Sheet;
