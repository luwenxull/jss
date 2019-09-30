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
  expect(r0.ruleText).toBe('color:green;')
  // r1
  expect(r1.key).toBe('container.title')
  expect(r1.selector).toBe('.container>.title')
  expect(r1.ruleText).toBe('color:blue;')
  // r2
  expect(r2.key).toBe('container.foot')
  expect(r2.selector).toBe('.container .foot')
  expect(r2.ruleText).toBe('color:red;')

  expect(sheet.classes['container']).toBe('container')
  expect(sheet.classes['container.title']).toBe('title')
  expect(sheet.classes['container.foot']).toBe('foot')
})

test('namespace', () => {
  const sheet = createSheet((data: {
    color: string,
    titleColor: string
  }) => {
    return {
      container: {
        color: data.color,
        title: [{
          color: data.titleColor,
          span: {
            color: 'green'
          }
        }, {
          concatBy: '>',
          namespace: 'n2_'
        }],
      }
    };
  }, 'n1_');
  sheet.inflate({
    color: 'green',
    titleColor: 'blue',
  })
  const [r0, r1, r3] = sheet.rules
  // r0
  expect(r0.key).toBe('container')
  expect(r0.className).toBe('n1_container')
  expect(r0.selector).toBe('.n1_container')
  // r1
  expect(r1.key).toBe('container.title')
  expect(r1.className).toBe('n2_title')
  expect(r1.selector).toBe('.n1_container>.n2_title')
  // r3
  expect(r3.key).toBe('container.title.span')
  expect(r3.className).toBe('n2_span')
  expect(r3.selector).toBe('.n1_container>.n2_title .n2_span')
})
