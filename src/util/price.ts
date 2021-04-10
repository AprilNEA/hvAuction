export function parsePrice(input: string): number | null {
  const matches = input.match(/([0-9,]+(?:\.\d*)?)([ckm]?)/i);

  if (matches) {
    const number = parseFloat(matches[1]);

    if (matches[2] === 'k' || matches[2] === 'K') {
      return number * 1000;
    }
    if (matches[2] === 'm' || matches[2] === 'M') {
      return number * 1000000;
    }

    return number;
  }

  return null;
}

export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${price / 1000000}m`;
  } if (price >= 1000) {
    return `${price / 1000}k`;
  }

  return String(price);
}
