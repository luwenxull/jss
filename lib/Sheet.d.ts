import JSSRule, { JSSStyle } from './Rule';
export interface IJSSSheetStyles {
  [prop: string]: JSSStyle;
}
export interface IJSSClasses {
  [prop: string]: string;
}
export declare class JSSSheet<T> {
  factory: (data: T) => IJSSSheetStyles;
  namespace: string;
  rules: JSSRule[];
  classes: IJSSClasses;
  private rulesDict;
  private $style?;
  constructor(factory: (data: T) => IJSSSheetStyles, namespace: string);
  inflate(data: T): this;
  replace(data: T): void;
  attach(): this;
  remove(): this;
  private getCssText;
  private registerRule;
  /**
   * 构建rule和真实rule的联系
   *
   * @private
   * @memberof JSSSheet
   */
  private analyze;
}
export default function createSheet<T>(
  factory: (data: T) => IJSSSheetStyles,
  namespace?: string
): JSSSheet<T>;
