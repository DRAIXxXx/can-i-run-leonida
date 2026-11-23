import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assessHardware } from '../js/model.mjs';
import { matchesModel, hardwareSections } from '../js/catalog.mjs';

test('catalog keeps relevant consumer hardware and excludes obsolete/server parts', async () => {
  const data = JSON.parse(await readFile(new URL('../assets/data/hardware.json', import.meta.url)));
  assert(data.cpu.length > 800 && data.cpu.length < 1200);
  assert(data.gpu.length > 250 && data.gpu.length < 400);
  for (const kind of ['cpu', 'gpu']) {
    assert.equal(new Set(data[kind]).size, data[kind].length);
    assert(data[kind].every(name => typeof name === 'string' && name.length <= 180));
  }
  assert(data.cpu.includes('AMD Ryzen 9 5900X'));
  assert(!data.cpu.some(name => /Xeon|EPYC|Pentium III|Motorola|Threadripper/i.test(name)));
  assert(!data.gpu.some(name => /Voodoo|Quadro|Instinct|GeForce 256|Radeon HD/i.test(name)));
  assert(data.cpu.includes('AMD Ryzen 5 3600'));
  assert(data.cpu.includes('Intel Core i7-6700K'));
  assert(data.gpu.includes('AMD Radeon RX 580 8 GB'));
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
  for (const cpu of ['Intel Xeon E5-2699 v4', 'Imaginary CPU 9999']) {
    assert.equal(assessHardware(cpu, 'RTX 3070', 32).statuses.CPU, 'unknown');
  }
  assert.equal(assessHardware('Apple M4', 'RTX 3070', 32).statuses.CPU, 'outside');
  assert.equal(assessHardware('AMD Ryzen 5 5600', 'RTX 3060 8 GB', 32).statuses.GPU, 'near');
});

test('search accepts common spacing and punctuation', () => {
  assert(matchesModel('Intel Core i7-12700F', 'i7 12700f'));
  assert(matchesModel('NVIDIA GeForce RTX 3060 8 GB', 'rtx3060 8gb'));
  assert(matchesModel('AMD Ryzen 9 5900X', 'amd 5900x'));
  assert(!matchesModel('NVIDIA GeForce RTX 3070', '3060'));
});

test('CPUs sort by brand, series and model, with suffix variants together', () => {
  const names = ['Intel Core i5-11400F', 'AMD Ryzen 5 5600', 'Intel Core i7-14700K',
    'Intel Core i9-14900KF', 'AMD Ryzen 7 9800X3D', 'Intel Core Ultra 7 265H',
    'Intel Core i9-14900K', 'Intel Core i5-14600K', 'AMD Ryzen 7 7800X3D'];
  const sections = hardwareSections(names, 'cpu');
  assert.deepEqual(sections.map(section => section.label), [
    'Intel · Core Ultra 200 series', 'Intel · 14th gen Core', 'Intel · 11th gen Core',
    'AMD · Ryzen 9000 series', 'AMD · Ryzen 7000 series', 'AMD · Ryzen 5000 series',
  ]);
  assert.deepEqual(sections[1].names, ['Intel Core i9-14900K', 'Intel Core i9-14900KF', 'Intel Core i7-14700K', 'Intel Core i5-14600K']);
  assert.equal(hardwareSections(['Intel Core i7-1165G7'], 'cpu')[0].label, 'Intel · 11th gen Core');
  assert.equal(hardwareSections(['Intel Core i7-1360P'], 'cpu')[0].label, 'Intel · 13th gen Core');
});

test('GPUs sort by brand, generation and model without alphabetic number errors', () => {
  const names = ['AMD Radeon RX 580', 'NVIDIA GeForce RTX 3060 12 GB', 'Intel Arc A750',
    'NVIDIA GeForce GTX 1080 Ti', 'NVIDIA GeForce RTX 5090', 'AMD Radeon RX 7900 XTX',
    'NVIDIA GeForce RTX 3070', 'Intel Arc B580', 'NVIDIA GeForce RTX 3060 8 GB',
    'NVIDIA GeForce GTX 1660'];
  const sections = hardwareSections(names, 'gpu');
  assert.deepEqual(sections.map(section => section.label), [
    'NVIDIA · RTX 50 series', 'NVIDIA · RTX 30 series', 'NVIDIA · GTX 16 series',
    'NVIDIA · GTX 10 series', 'AMD · Radeon RX 7000 series', 'AMD · Radeon RX 500 series',
    'Intel · Arc B series', 'Intel · Arc A series',
  ]);
  assert.deepEqual(sections[1].names, ['NVIDIA GeForce RTX 3070', 'NVIDIA GeForce RTX 3060 8 GB', 'NVIDIA GeForce RTX 3060 12 GB']);
  assert.equal(hardwareSections(['Intel Arc A350M'], 'gpu')[0].label, 'Intel · Arc A series');
  assert.deepEqual(hardwareSections(['AMD Radeon RX 7900 XT', 'AMD Radeon RX 7900 XTX'], 'gpu')[0].names,
    ['AMD Radeon RX 7900 XTX', 'AMD Radeon RX 7900 XT']);
});

test('sorting retains every catalog model and its exact name', async () => {
  const data = JSON.parse(await readFile(new URL('../assets/data/hardware.json', import.meta.url)));
  for (const kind of ['cpu', 'gpu']) {
    const sorted = hardwareSections(data[kind], kind).flatMap(section => section.names);
    assert.equal(sorted.length, data[kind].length);
    assert.deepEqual(new Set(sorted), new Set(data[kind]));
    assert.deepEqual(hardwareSections([...data[kind]].reverse(), kind), hardwareSections(data[kind], kind));
  }
});


test('Silliana desktop bands and console fixes are applied', () => {
  for (const gpu of ['RTX 3060 8 GB', 'RX 6600', 'Arc A750', 'Arc A770 8 GB', 'RTX 2060 Super']) {
    assert.equal(assessHardware('AMD Ryzen 5 5600', gpu, 16, 'low').statuses.GPU, 'near', gpu);
  }
  for (const gpu of ['GTX 1660', 'GTX 1650 Super', 'RX 5500 XT', 'RTX 3050 8 GB', 'RX 6500 XT']) {
    assert.equal(assessHardware('AMD Ryzen 5 5600', gpu, 16, 'low').statuses.GPU, 'below', gpu);
  }
  for (const gpu of ['RTX 4060', 'RTX 2080 Super', 'RX 6700', 'Arc B580']) {
    assert.equal(assessHardware('AMD Ryzen 5 5600', gpu, 32, 'series-x').statuses.GPU, 'near', gpu);
  }
  for (const cpu of ['Intel Core i5-13500', 'AMD Ryzen 5 8600G', 'Intel Core i7-11700']) {
    assert.equal(assessHardware(cpu, 'RTX 3070', 16, 'low').statuses.CPU, 'near', cpu);
  }
});

test('laptop GPU and integrated comparisons retain their distinct bands', () => {
  assert.equal(assessHardware('Intel Core i7-12700H', 'GTX 1650 Laptop', 32, 'series-s').statuses.GPU, 'below');
  assert.notEqual(assessHardware('AMD Ryzen AI 9 HX 370', 'RTX 4060 Laptop', 32, 'series-x').statuses.GPU, 'unknown');
  assert.equal(assessHardware('AMD Ryzen 5 5600', 'AMD Radeon 780M', 32, 'low').statuses.GPU, 'below');
});
