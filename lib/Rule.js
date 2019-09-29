"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSSRule {
    constructor(key, style, // 构造函数可以传递数组
    option, registerRule) {
        this.ruleText = '';
        let userDefinedOption = {}; // 用户自定义参数
        if (style instanceof Array) {
            this.style = style[0];
            userDefinedOption = style[1];
        }
        else {
            this.style = style;
        }
        this.option = Object.assign({}, option, userDefinedOption);
        let { parent, concatBy = ' ' } = this.option;
        // TODO 防止重复
        this.selfSelector = key;
        if (parent instanceof JSSRule) {
            // 连接parent的选择器
            this.selector = `${parent.selector}${concatBy}.${this.selfSelector}`;
            this.key = parent.key + '.' + key;
        }
        else {
            this.selector = '.' + this.selfSelector;
            this.key = key;
        }
        // 注册到sheet
        registerRule(this);
        Object.keys(this.style).forEach(key => {
            const value = this.style[key];
            if (typeof value === 'string' || typeof value === 'number') {
                this.ruleText += `${key}:${value};`;
            }
            else {
                new JSSRule(key, value, {
                    parent: this,
                    concatBy: ' '
                }, registerRule);
            }
        });
    }
    bindTo(rule) {
        this.$rule = rule;
    }
}
exports.default = JSSRule;
