import createSheet from '../index'

test('createSheet', () => {
  const sheet = createSheet((data: {
    color: string,
    titleColor: string
  }) => {
    return {};
  });
  expect(sheet.rules.length).toBe(0);
})

test('inflate', () => {
  const sheet = createSheet((data: {
    color: string,
    titleColor: string
  }) => {
    return {
      container: {
        color: data.color,
        title: [{
          color: data.titleColor
        }, {
          concatBy: '>'
        }],
        foot: {
          color: 'red'
        }
      }
    };
  });
  expect(sheet.rules.length).toBe(0);
  sheet.inflate({
    color: 'green',
    titleColor: 'blue',
  })
  expect(sheet.rules.length).toBe(3)
  const [r0, r1, r2] = sheet.rules
  // r0
  expect(r0.key).toBe('container')
  expect(r0.selector).toBe('.container')
  expect(r0.selfSelector).toBe('container')
  expect(r0.ruleText).toBe('color:green;')
  // r1
  expect(r1.key).toBe('container.title')
  expect(r1.selector).toBe('.container>.title')
  expect(r1.selfSelector).toBe('title')
  expect(r1.ruleText).toBe('color:blue;')
  // r2
  expect(r2.key).toBe('container.foot')
  expect(r2.selector).toBe('.container .foot')
  expect(r2.selfSelector).toBe('foot')
  expect(r2.ruleText).toBe('color:red;')

  expect(sheet.classes['container']).toBe('container')
  expect(sheet.classes['container.title']).toBe('title')
  expect(sheet.classes['container.foot']).toBe('foot')
})
