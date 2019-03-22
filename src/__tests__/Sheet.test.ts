import {Sheet} from '../Sheet'

test('translate style', () => {
  const sheet = new Sheet({
    container: {
      color: 'red',
      inherits: {
        '& title': {
          fontSize: '12px'
        }
      }
    },
    foot(d) {
      return {
        color: d.color
      }
    }
  }, {color: 'green'})

  expect(sheet.rules.length).toBe(3)

  const [r1, r2, r3] = sheet.rules
  expect(r1.ruleText).toBe('container{color:red}')
  expect(r2.ruleText).toBe('container title{fontSize:12px}')
  expect(r3.ruleText).toBe('foot{color:green}')
})
