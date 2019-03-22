export declare type JSSStyle = {
  [prop: string]: JSSRuleUnion;
};
export declare type JSSRuleDescription = {
  [prop: string]: number | string | JSSStyle;
};
export declare type JSSRuleDescriptionFactory = (
  data: any
) => JSSRuleDescription;
export declare type JSSRuleUnion =
  | JSSRuleDescription
  | JSSRuleDescriptionFactory;
export interface IJSSRule {
  selectorText: string;
  ruleText: string;
  rules: JSSRuleUnion;
  inflate(data: any, callback?: (style: JSSStyle) => void): void;
  link(rule: CSSStyleRule): void;
}
export declare class JSSRule implements IJSSRule {
  selectorText: string;
  rules: JSSRuleUnion;
  private rule;
  ruleText: string;
  constructor(selectorText: string, rules: JSSRuleUnion);
  inflate(data: any, callback?: (style: JSSStyle) => void): void;
  link(rule: CSSStyleRule): void;
}
