export interface userDefinedOption {
    concatBy?: string;
}
declare type JSSStyleTuple = [JSSStyle, userDefinedOption];
declare type JSSStyleComplex = JSSStyle | JSSStyleTuple;
export declare type JSSStyle = {
    [prop: string]: string | number | JSSStyleComplex;
};
export interface IJSSRuleOption {
    parent?: JSSRule;
    concatBy?: string;
}
export default class JSSRule {
    key: string;
    selector: string;
    selfSelector: string;
    style: JSSStyle;
    ruleText: string;
    private option;
    private $rule?;
    constructor(key: string, style: JSSStyleComplex, // 构造函数可以传递数组
    option: IJSSRuleOption, registerRule: (ule: JSSRule) => void);
    bindTo(rule: CSSStyleRule): void;
}
export {};
