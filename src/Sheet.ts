import { IJSSRule } from './Rule'


export interface IJSSSheet {
  rules: IJSSRule[]
  update(): void
  attach(data?: any): void
}

export class JSSSheet implements IJSSSheet {
  public rules: IJSSRule[] = []
  constructor() {

  }

  public update() {

  }

  public attach(data?: any) {
    let styleText = ''
    this.rules.forEach(rule => {
      styleText += rule.translate(data)
    })
    let style = document.createElement('style')
    style.innerText = styleText
  }

}