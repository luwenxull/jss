export interface userDefinedOption {
  concatBy?: string;
}

type JSSStyleTuple = [JSSStyle, userDefinedOption];

type JSSStyleComplex = JSSStyle | JSSStyleTuple;

export type JSSStyle = {
  [prop: string]: string | number | JSSStyleComplex;
};

export interface IJSSRuleOption {
  parent?: JSSRule;
  concatBy?: string;
}

export default class JSSRule {
  public key: string;
  public selector: string;
  public selfSelector: string;
  public style: JSSStyle;
  public ruleText: string = '';
  private option: IJSSRuleOption;
  private $rule?: CSSStyleRule;
  constructor(
    key: string,
    style: JSSStyleComplex, // 构造函数可以传递数组
    option: IJSSRuleOption,
    registerRule: (ule: JSSRule) => void
  ) {
    let userDefinedOption = {}; // 用户自定义参数
    if (style instanceof Array) {
      this.style = style[0];
      userDefinedOption = style[1];
    } else {
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
    } else {
      this.selector = '.' + this.selfSelector;
      this.key = key;
    }
    // 注册到sheet
    registerRule(this);
    Object.keys(this.style).forEach(key => {
      const value = this.style[key];
      if (typeof value === 'string' || typeof value === 'number') {
        this.ruleText += `${key}:${value};`;
      } else {
        new JSSRule(
          key,
          value,
          {
            parent: this,
            concatBy: ' '
          },
          registerRule
        );
      }
    });
  }

  public bindTo(rule: CSSStyleRule) {
    this.$rule = rule;
  }
}
