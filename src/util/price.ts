export function parsePrice(input: string): number | null {
  const matches = input.match(/([0-9,]+(?:\.\d*)?)([ckm]?)/i);

  if (matches) {
    const number = parseFloat(matches[1]);

    if (matches[2] === 'k' || matches[2] === 'K') {
      return number * 1000;
    ***REMOVED***
    if (matches[2] === 'm' || matches[2] === 'M') {
      return number * 1000000;
    ***REMOVED***

    return number;
  ***REMOVED***

  return null;
***REMOVED***

export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${price / 1000000***REMOVED***m`;
  ***REMOVED*** if (price >= 1000) {
    return `${price / 1000***REMOVED***k`;
  ***REMOVED***

  return String(price);
***REMOVED***
