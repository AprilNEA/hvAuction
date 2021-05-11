/** @deprecated - Not tested. May not work */
export function ipsPostEncoder(input: string): string {
  return input.split('').map(c => {
    if (/\p{Unified_Ideograph}/u.test(c)) { // ES2015 CJK Detection
      return `%u${c.charCodeAt(0).toString(16).toUpperCase()}`; // IPB use % as identifier
    }

    return c;
  }).join('');
}
