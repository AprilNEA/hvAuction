type LexType = 'START' | 'NAME' | 'PRICE' | 'END';

interface LexToken {
  type: LexType;
  index: number;
  value: string;
***REMOVED***

export interface ParseBidResults {
  [key: string]: string | null
***REMOVED***

const INVALID_TOKENS = new Set(['[', ']', '(', ')', '{', '***REMOVED***', '-', ':']);

/**
 * Tokenize input string.
 */
export function lexer(str: string): LexToken[] {
  const tokens: LexToken[] = [];
  const len = str.length;
  let i = 0;
  let STATUS: LexType = 'START';

  while (i < str.length) {
    const char = str[i].toLowerCase();
    const charCode = char.charCodeAt(0);

    if (char === ' ' || char === '\n' || char === '\t' || char === '\f' || char === '\r' || INVALID_TOKENS.has(char)) {
      i++;
      continue;
    ***REMOVED***

    if (
      i + 2 < len && char === 'b' && str[i + 1] === 'i' && str[i + 2] === 'd' // bid
      || i + 2 < len && char === 'a' && str[i + 1] === 'n' && str[i + 2] === 'd' // and
    ) {
      i = i + 2;
      continue;
    ***REMOVED***

    if (STATUS === 'NAME') {
      if (
        i + 4 < len && char === 's' && str[i + 1] === 't' && str[i + 2] === 'a' && str[i + 3] === 'r' && str[i + 4] === 't' // start
        || i + 5 < len && char === 'c' && str[i + 1] === 'a' && str[i + 2] === 'n' && str[i + 3] === 'c' && str[i + 4] === 'e' && str[i + 5] === 'l' // cancel
      ) {
        STATUS = 'PRICE';
        i = i + 4;
        tokens.push({ type: STATUS, index: i, value: 'start' ***REMOVED***);
        continue;
      ***REMOVED*** else if (charCode >= 48 && charCode <= 57) {
        let price = '';
        let j = i;

        while (j < len) {
          const code = str.toLowerCase().charCodeAt(j);

          if (
            (code >= 48 && code <= 57) // `0-9`
            || code === 44 // `.`
            || code === 46 // `,`
            || code === 107 // `k`
            || code === 109 // `m`
          ) {
            price += str[j++];
            continue;
          ***REMOVED***

          break;
        ***REMOVED***

        if (price) {
          STATUS = 'PRICE';
          tokens.push({ type: STATUS, index: i, value: price ***REMOVED***);
        ***REMOVED***

        if (i === j) {
          i = i + 1;
        ***REMOVED*** else {
          i = j;
        ***REMOVED***

        continue;
      ***REMOVED***
    ***REMOVED***

    if (
      i + 2 < len
      && (
        char === 'm' && str[i + 1] === 'a' && str[i + 2] === 't' // mat
        || char === 'o' && str[i + 1] === 'n' && str[i + 2] === 'e' // one
        || char === 't' && str[i + 1] === 'w' && str[i + 2] === 'o' // sto
        || char === 's' && str[i + 1] === 't' && str[i + 2] === 'a' // sta
        || char === 'c' && str[i + 1] === 'l' && str[i + 2] === 'o' // clo
        || char === 'l' && str[i + 1] === 'i' && str[i + 2] === 'g' // lig
        || char === 'h' && str[i + 1] === 'e' && str[i + 2] === 'a' // hea
      )
    ) {
      let name = '';
      let j = i;

      while (j < len) {
        const code = str.charCodeAt(j);

        if (
          (code >= 48 && code <= 57) // `0-9`
          || (code >= 65 && code <= 90) // `A-Z`
          || (code >= 97 && code <= 122) // `a-z`
          || code === 95 // `_`
        ) {
          name += str[j++];
          continue;
        ***REMOVED***

        break;
      ***REMOVED***

      if (name) {
        STATUS = 'NAME';
        tokens.push({ type: STATUS, index: i, value: name ***REMOVED***);
      ***REMOVED***

      i = j;
      continue;
    ***REMOVED***

    i++;
  ***REMOVED***

  tokens.push({ type: 'END', index: i, value: '' ***REMOVED***);

  return tokens;
***REMOVED***

export function parse(input: string): ParseBidResults {
  const results: ParseBidResults = {***REMOVED***;
  const tokens = lexer(input);

  for (const token of tokens) {
    if (token.type === 'NAME') {
      results[token.value.toLowerCase()] = null;
    ***REMOVED***
    if (token.type === 'PRICE') {
      Object.keys(results).forEach(k => {
        if (results[k] === null) results[k] = token.value;
      ***REMOVED***);
    ***REMOVED***
    if (token.type === 'END') {
      break;
    ***REMOVED***
  ***REMOVED***

  return results;
***REMOVED***
