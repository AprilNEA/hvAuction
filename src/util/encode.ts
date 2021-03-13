export function ipsPostEncoder(input: string): string {
  return input.split('').map(c => {
    if (/\p{Unified_Ideograph***REMOVED***/u.test(c)) { // ES2015 CJK Detection
      return `%u${c.charCodeAt(0).toString(16).toUpperCase()***REMOVED***`;
    ***REMOVED***

    return encodeURIComponent(c);
  ***REMOVED***).join('');
***REMOVED***
