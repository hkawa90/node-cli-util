const formatter = require('../dist/index').formatter;

test('formatter placeholder', () => {
  expect(formatter('{percentage}', {percentage: 30})).toBe('30');
  expect(formatter('{percentage}', {percentage: 'string'})).toBe('string');
  expect(formatter('{percentage}', {percentage: true})).toBe('true');
  expect(formatter('{percentage}', {percentage: {name : 'value'}})).toBe('[object Object]');
});

test('formatter %s', () => {
  expect(formatter('{percentage}[%s]', {percentage: 30})).toBe('30');
  expect(formatter('{percentage}[%s]', {percentage: '30'})).toBe('30');
});

test('formatter %10s', () => {
  expect(formatter('{percentage}[%10s]', {percentage: 30})).toBe('        30');
  expect(formatter('{percentage}[%10s]', {percentage: '30'})).toBe('        30');
});

test('formatter %-10s', () => {
  expect(formatter('{percentage}[%-10s]', {percentage: 30})).toBe('30        ');
  expect(formatter('{percentage}[%-10s]', {percentage: '30'})).toBe('30        ');
});

test('formatter %d', () => {
  expect(formatter('{percentage}[%d]', {percentage: 30})).toBe('30');
  expect(formatter('{percentage}[%d]', {percentage: '30'})).toBe('30');
  expect(formatter('{percentage}[%d]', {percentage: 30.5})).toBe('30');
});

test('formatter %10d', () => {
  expect(formatter('{percentage}[%10d]', {percentage: 30})).toBe('        30');
  expect(formatter('{percentage}[%10d]', {percentage: '30'})).toBe('        30');
  expect(formatter('{percentage}[%10d]', {percentage: 30.5})).toBe('        30');
  expect(formatter('{percentage}[%3d]', {percentage: 1234})).toBe('1234');
});

test('formatter %-10d', () => {
  expect(formatter('{percentage}[%-10d]', {percentage: 30})).toBe('30        ');
  expect(formatter('{percentage}[%-10d]', {percentage: '30'})).toBe('30        ');
  expect(formatter('{percentage}[%-10d]', {percentage: 30.5})).toBe('30        ');
});

test('formatter %f', () => {
  expect(formatter('{percentage}[%5.1f]', {percentage: 30.5})).toBe(' 30.5');
  expect(formatter('{percentage}[%5.f]',  {percentage: 30.5})).toBe('   31');
  expect(formatter('{percentage}[%5.2f]', {percentage: 30.5})).toBe('30.50');
  expect(formatter('{percentage}[%5.2f]',   {percentage: 30})).toBe('30.00');
});

test('formatter %e', () => {
  expect(formatter('{percentage}[%8.3e]', {percentage: 1234.5678})).toBe('1.235e+3');
});

test('formatter %c', () => {
  expect(formatter('{percentage}[%5c]', {percentage: 'formatter'})).toBe('    f');
  expect(formatter('{percentage}[%-5c]', {percentage: 'formatter'})).toBe('f    ');
});

test('formatter %x', () => {
  expect(formatter('{percentage}[%5x]', {percentage: 0x3F})).toBe('   3f');
  expect(formatter('{percentage}[%-5x]', {percentage: 0x3F})).toBe('3f   ');
  expect(formatter('{percentage}[%5X]', {percentage: 0x3F})).toBe('   3F');
  expect(formatter('{percentage}[%-5X]', {percentage: 0x3F})).toBe('3F   ');
});

test('formatter zero padding %010d', () => {
  expect(formatter('{percentage}[%010d]', {percentage: 30})).toBe('0000000030');
  expect(formatter('{percentage}[%010d]', {percentage: '30'})).toBe('0000000030');
  expect(formatter('{percentage}[%010d]', {percentage: 30.5})).toBe('0000000030');
});

test('formatter quote', () => {
  expect(formatter('{{percentage}}', {percentage: 30})).toBe('{30}');
  expect(formatter('"{"percentage"}"', {percentage: 30})).toBe('"{"percentage"}"');
});

test('formatter wrong format', () => {
  expect(formatter('{}', {percentage: 30})).toBe('{}');
  expect(formatter('{}[%-10s]', {percentage: 30})).toBe('{}[%-10s]');
  expect(formatter('{per}', {percentage: '30'})).toBe('');
});

test('formatter wrong property', () => {
  expect(formatter('{percentage}', {percentage: null})).toBe('null');
  expect(formatter('{percentage}', {})).toBe('');
});