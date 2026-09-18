import type { Bit } from './primitives/BinaryToggle.js';

export function halfAdd(a: Bit, b: Bit) {
  return { sum: (a ^ b) as Bit, carry: (a & b) as Bit };
}

export function fullAdd(a: Bit, b: Bit, carryIn: Bit) {
  const first = halfAdd(a, b);
  const second = halfAdd(first.sum, carryIn);
  return { first, second, sum: second.sum, carryOut: (first.carry | second.carry) as Bit };
}
