const formatParser = require('../dist/index').formatParser;

test('formatParser placeholder', () => {
  expect(formatParser('{percentage}', {percentage: 30})).toBe('30');
});

test('formatParser %s', () => {
  expect(formatParser('{percentage}[%s]', {percentage: 30})).toBe('30');
  expect(formatParser('{percentage}[%s]', {percentage: '30'})).toBe('30');
});

test('formatParser %10s', () => {
  expect(formatParser('{percentage}[%10s]', {percentage: 30})).toBe('        30');
  expect(formatParser('{percentage}[%10s]', {percentage: '30'})).toBe('        30');
});

test('formatParser %-10s', () => {
  expect(formatParser('{percentage}[%-10s]', {percentage: 30})).toBe('30        ');
  expect(formatParser('{percentage}[%-10s]', {percentage: '30'})).toBe('30        ');
});

test('formatParser %d', () => {
  expect(formatParser('{percentage}[%d]', {percentage: 30})).toBe('30');
  expect(formatParser('{percentage}[%d]', {percentage: '30'})).toBe('30');
  expect(formatParser('{percentage}[%d]', {percentage: 30.5})).toBe('30');
});

test('formatParser %10d', () => {
  expect(formatParser('{percentage}[%10d]', {percentage: 30})).toBe('        30');
  expect(formatParser('{percentage}[%10d]', {percentage: '30'})).toBe('        30');
  expect(formatParser('{percentage}[%10d]', {percentage: 30.5})).toBe('        30');
});

test('formatParser %-10d', () => {
  expect(formatParser('{percentage}[%-10d]', {percentage: 30})).toBe('30        ');
  expect(formatParser('{percentage}[%-10d]', {percentage: '30'})).toBe('30        ');
  expect(formatParser('{percentage}[%-10d]', {percentage: 30.5})).toBe('30        ');
});

test('formatParser zero padding %010d', () => {
  expect(formatParser('{percentage}[%010d]', {percentage: 30})).toBe('0000000030');
  expect(formatParser('{percentage}[%010d]', {percentage: '30'})).toBe('0000000030');
  expect(formatParser('{percentage}[%010d]', {percentage: 30.5})).toBe('0000000030');
});

test('formatParser quote', () => {
  expect(formatParser('{{percentage}}', {percentage: 30})).toBe('{30}');
  expect(formatParser('"{"percentage"}"', {percentage: 30})).toBe('"{"percentage"}"');
});

test('formatParser wrong format', () => {
  expect(formatParser('{}', {percentage: 30})).toBe('{}');
  expect(formatParser('{}[%-10s]', {percentage: 30})).toBe('{}[%-10s]');
  expect(formatParser('{per}', {percentage: '30'})).toBe('');
});

test('formatParser wrong property', () => {
  expect(formatParser('{percentage}', {percentage: null})).toBe('null');
  expect(formatParser('{percentage}', {})).toBe('');
});