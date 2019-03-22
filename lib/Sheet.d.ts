import { IJSSRule, JSSStyle } from './Rule';
export interface IJSSSheet {
  rules: IJSSRule[];
  update(): void;
  attach(parent: HTMLElement, data?: any): void;
}
export declare class Sheet implements IJSSSheet {
  rules: IJSSRule[];
  private classes;
  constructor(style: JSSStyle, data?: any);
  update(): void;
  attach(parent: HTMLElement, data?: any): void;
  private createStyleText;
  private linkStyleToRule;
  private translateStyle;
}
