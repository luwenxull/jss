"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = __importDefault(require("./Rule"));
class JSSSheet {
    constructor(factory) {
        this.factory = factory;
        this.rules = [];
        this.classes = {};
        // 根据rule.selector做映射
        this.rulesDict = {};
    }
    inflate(data) {
        const styles = this.factory(data);
        Object.keys(styles).forEach(key => {
            new Rule_1.default(key, styles[key], {}, this.registerRule.bind(this));
        });
        return this;
    }
    update(data) {
    }
    attach() {
        const style = document.createElement('style');
        let innerHTML = '';
        this.rules.forEach(rule => {
            innerHTML += `${rule.selector}{${rule.ruleText}}`;
        });
        // style.type = 'text/css'
        style.innerHTML = innerHTML;
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
    registerRule(rule) {
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
exports.JSSSheet = JSSSheet;
function createSheet(factory) {
    return new JSSSheet(factory);
}
exports.default = createSheet;
