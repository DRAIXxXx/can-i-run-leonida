import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assessHardware } from '../js/model.mjs';
import { matchesModel } from '../js/catalog.mjs';

test('catalog retains thousands of unique CPU and GPU names', async () => {
  const data = JSON.parse(await readFile(new URL('../assets/data/hardware.json', import.meta.url)));
  assert.equal(data.cpu.length, 4641);
  assert.equal(data.gpu.length, 2076);
  for (const kind of ['cpu', 'gpu']) {
    assert.equal(new Set(data[kind]).size, data[kind].length);
    assert(data[kind].every(name => typeof name === 'string' && name.length <= 180));
  }
  assert(data.cpu.includes('AMD Ryzen 9 5900X'));
  assert(data.cpu.includes('Intel Xeon E5-2699 v4'));
  assert(data.gpu.includes('NVIDIA GeForce GTX 1080 Ti'));
});

test('common desktop variants resolve without regressing laptop/AI matches', () => {
  for (const cpu of ['AMD Ryzen 9 5900X', 'AMD Ryzen 7 5700X3D', 'AMD Ryzen 5 7500F',
    'Intel Core i7-12700F', 'Intel Core i9-14900KS', 'Intel Core Ultra 7 265KF',
    'Intel Core i7-12700H', 'Intel Core Ultra 7 265H', 'AMD Ryzen AI 9 HX 370']) {
    for (const reference of ['low', 'series-x', 'series-s', 'ps5', 'ps5-pro']) {
      assert.notEqual(assessHardware(cpu, 'RTX 3070', 32, reference).statuses.CPU, 'unknown', `${cpu}: ${reference}`);
    }
  }
});

test('unranked and distinct models never inherit a guessed performance band', () => {
  for (const cpu of ['Intel Xeon E5-2699 v4', 'Imaginary CPU 9999', 'Intel Core i5-12600']) {
    assert.equal(assessHardware(cpu, 'RTX 3070', 32).statuses.CPU, 'unknown');
  }
  assert.equal(assessHardware('Apple M4', 'RTX 3070', 32).statuses.CPU, 'outside');
  assert.equal(assessHardware('AMD Ryzen 5 5600', 'RTX 3060 8 GB', 32).statuses.GPU, 'below');
});

test('search accepts common spacing and punctuation', () => {
  assert(matchesModel('Intel Core i7-12700F', 'i7 12700f'));
  assert(matchesModel('NVIDIA GeForce RTX 3060 8 GB', 'rtx3060 8gb'));
  assert(matchesModel('AMD Ryzen 9 5900X', 'amd 5900x'));
  assert(!matchesModel('NVIDIA GeForce RTX 3070', '3060'));
});
