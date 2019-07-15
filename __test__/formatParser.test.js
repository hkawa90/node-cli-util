const formater = require('../dist/index').formater;

test('formater placeholder', () => {
  expect(formater('{percentage}', {percentage: 30})).toBe('30');
});

test('formater %s', () => {
  expect(formater('{percentage}[%s]', {percentage: 30})).toBe('30');
  expect(formater('{percentage}[%s]', {percentage: '30'})).toBe('30');
});

test('formater %10s', () => {
  expect(formater('{percentage}[%10s]', {percentage: 30})).toBe('        30');
  expect(formater('{percentage}[%10s]', {percentage: '30'})).toBe('        30');
});

test('formater %-10s', () => {
  expect(formater('{percentage}[%-10s]', {percentage: 30})).toBe('30        ');
  expect(formater('{percentage}[%-10s]', {percentage: '30'})).toBe('30        ');
});

test('formater %d', () => {
  expect(formater('{percentage}[%d]', {percentage: 30})).toBe('30');
  expect(formater('{percentage}[%d]', {percentage: '30'})).toBe('30');
  expect(formater('{percentage}[%d]', {percentage: 30.5})).toBe('30');
});

test('formater %10d', () => {
  expect(formater('{percentage}[%10d]', {percentage: 30})).toBe('        30');
  expect(formater('{percentage}[%10d]', {percentage: '30'})).toBe('        30');
  expect(formater('{percentage}[%10d]', {percentage: 30.5})).toBe('        30');
});

test('formater %-10d', () => {
  expect(formater('{percentage}[%-10d]', {percentage: 30})).toBe('30        ');
  expect(formater('{percentage}[%-10d]', {percentage: '30'})).toBe('30        ');
  expect(formater('{percentage}[%-10d]', {percentage: 30.5})).toBe('30        ');
});

test('formater zero padding %010d', () => {
  expect(formater('{percentage}[%010d]', {percentage: 30})).toBe('0000000030');
  expect(formater('{percentage}[%010d]', {percentage: '30'})).toBe('0000000030');
  expect(formater('{percentage}[%010d]', {percentage: 30.5})).toBe('0000000030');
});

test('formater quote', () => {
  expect(formater('{{percentage}}', {percentage: 30})).toBe('{30}');
  expect(formater('"{"percentage"}"', {percentage: 30})).toBe('"{"percentage"}"');
});

test('formater wrong format', () => {
  expect(formater('{}', {percentage: 30})).toBe('{}');
  expect(formater('{}[%-10s]', {percentage: 30})).toBe('{}[%-10s]');
  expect(formater('{per}', {percentage: '30'})).toBe('');
});

test('formater wrong property', () => {
  expect(formater('{percentage}', {percentage: null})).toBe('null');
  expect(formater('{percentage}', {})).toBe('');
});