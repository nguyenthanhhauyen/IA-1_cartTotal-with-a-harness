import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

// Options from the slides, shared by every test below.
const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }

test('the example from the slides returns 467400', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  assert.equal(cartTotal(items, options), 467400)
})

test('the total is a number, not a string', () => {
  const items = [{ name: 'Sổ tay', price: 45000, qty: 1 }]
  assert.equal(typeof cartTotal(items, options), 'number')
})

test('an empty cart returns 0 — no VAT, no shipping', () => {
  assert.equal(cartTotal([], options), 0)
})

test('shipping is free when the subtotal equals the threshold', () => {
  // subtotal 500000 → VAT 40000, shipping 0
  const items = [{ name: 'Balo', price: 500000, qty: 1 }]
  assert.equal(cartTotal(items, options), 540000)
})

test('shipping is charged when the subtotal is just below the threshold', () => {
  // subtotal 499999 → VAT 39999.92, shipping 30000 → 569998.92 → 569999
  const items = [{ name: 'Balo', price: 499999, qty: 1 }]
  assert.equal(cartTotal(items, options), 569999)
})

test('the total is rounded to the whole đồng', () => {
  // subtotal 12345 → VAT 987.6, shipping 30000 → 43332.6 → 43333
  const items = [{ name: 'Bút', price: 12345, qty: 1 }]
  assert.equal(cartTotal(items, options), 43333)
})

test('a negative price throws RangeError', () => {
  const items = [{ name: 'Lỗi', price: -1, qty: 1 }]
  assert.throws(() => cartTotal(items, options), RangeError)
})

test('a non-integer qty throws RangeError', () => {
  const items = [{ name: 'Lỗi', price: 1000, qty: 1.5 }]
  assert.throws(() => cartTotal(items, options), RangeError)
})

test('a qty of 0 throws RangeError', () => {
  const items = [{ name: 'Lỗi', price: 1000, qty: 0 }]
  assert.throws(() => cartTotal(items, options), RangeError)
})

test('a negative qty throws RangeError', () => {
  const items = [{ name: 'Lỗi', price: 1000, qty: -2 }]
  assert.throws(() => cartTotal(items, options), RangeError)
})
