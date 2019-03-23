import { JSSRule } from '../Rule'
test('inflate', () => {
  const rule = new JSSRule('.a', {
    color: 'red',
    backgroundColor: 'blue'
  })
  rule.inflate(null)
  expect(rule.selectorText).toBe('.a')
  expect(rule.ruleText).toBe('.a{color:red;background-color:blue;}')

  const inherits = {
    '& .b': {
      color: 'red'
    }
  }
  const rule2 = new JSSRule('.a', (d) => ({
    color: d.color,
    inherits,
  }))
  const fn = jest.fn()
  rule2.inflate({ color: 'blue' }, fn)
  expect(rule2.ruleText).toBe('.a{color:blue;}')
  expect(fn.mock.calls).toEqual([[inherits]])
})

test('update', () => {
  // const 
})