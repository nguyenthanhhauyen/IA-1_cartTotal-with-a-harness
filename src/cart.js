// cartTotal — see README.md for the specification.
//
// items:   [{ name, price, qty }]
// options: { vatRate, freeShipFrom, shipFee }
// returns: subtotal + VAT + shipping, as a number rounded to the whole đồng
export function cartTotal(items, options) {
  if (!items || items.length === 0) return 0

  for (const item of items) {
    if (!Number.isFinite(item.price) || item.price < 0) {
      throw new RangeError(`invalid price for "${item.name}": ${item.price}`)
    }
    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      throw new RangeError(`invalid qty for "${item.name}": ${item.qty}`)
    }
  }

  const { vatRate, freeShipFrom, shipFee } = options
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const vat = subtotal * vatRate
  const shipping = subtotal >= freeShipFrom ? 0 : shipFee

  return Math.round(subtotal + vat + shipping)
}
