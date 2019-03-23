import { JSSStyle } from './Rule';
export interface IJSSSheet {
  update(data: any): void;
  attach(parent: HTMLElement): void;
}
export default class Sheet implements IJSSSheet {
  private rules;
  private classes;
  constructor(style: JSSStyle, data?: any);
  update(data: any): void;
  attach(parent: HTMLElement): void;
  private linkStyleToRule;
  private translateStyle;
}
