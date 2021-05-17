import 'ts-mocha';
import chai from 'chai';
chai.should();

import { lexer, parse } from './tokenizer';

describe('bid tokenizer', () => {
  describe('Lexer', () => {
    it('Hea12 150.2k', () => {
      const lexers = lexer('Hea12 150.2k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea12');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('150.2k');
      lexers[2].type.should.eql('END');
    });

    it('Sta01 100m', () => {
      const lexers = lexer('Sta01 100m');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Sta01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('100m');
      lexers[2].type.should.eql('END');
    });

    it('Sta01 start', () => {
      const lexers = lexer('Sta01 start');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Sta01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('start');
      lexers[2].type.should.eql('END');
    });

    it('[Hea01] 1000k', () => {
      const lexers = lexer('[Hea01] 1000k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1000k');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 1000000', () => {
      const lexers = lexer('Hea01 1000000');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1000000');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 1,000,000', () => {
      const lexers = lexer('Hea01 1,000,000');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1,000,000');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 1000000c', () => {
      const lexers = lexer('Hea01 1000000c');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1000000');
      lexers[2].type.should.eql('END');
    });

    it('I want Hea01 1m', () => {
      const lexers = lexer('I want Hea01 1m');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1m');
      lexers[2].type.should.eql('END');
    });

    it('hea01 1m', () => {
      const lexers = lexer('hea01 1m');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1m');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 Hea02 Hea03 100k', () => {
      const lexers = lexer('Hea01 Hea02 Hea03 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('NAME');
      lexers[2].value.should.eql('Hea03');
      lexers[3].type.should.eql('PRICE');
      lexers[3].value.should.eql('100k');
      lexers[4].type.should.eql('END');
    });

    it('[Hea01] [Hea02] [Hea03] 100k', () => {
      const lexers = lexer('[Hea01] [Hea02] [Hea03] 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('NAME');
      lexers[2].value.should.eql('Hea03');
      lexers[3].type.should.eql('PRICE');
      lexers[3].value.should.eql('100k');
      lexers[4].type.should.eql('END');
    });

    it('[Hea01][Hea02][Hea03] 100k', () => {
      const lexers = lexer('[Hea01][Hea02][Hea03] 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('NAME');
      lexers[2].value.should.eql('Hea03');
      lexers[3].type.should.eql('PRICE');
      lexers[3].value.should.eql('100k');
      lexers[4].type.should.eql('END');
    });

    it('Hea01\\nHea02\\nHea03\\n100k', () => {
      const lexers = lexer('Hea01\nHea02\nHea03\n100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('NAME');
      lexers[2].value.should.eql('Hea03');
      lexers[3].type.should.eql('PRICE');
      lexers[3].value.should.eql('100k');
      lexers[4].type.should.eql('END');
    });

    it('Hea01\\nHea02\\nHea03\\nstart', () => {
      const lexers = lexer('Hea01\nHea02\nHea03\nstart');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('NAME');
      lexers[2].value.should.eql('Hea03');
      lexers[3].type.should.eql('PRICE');
      lexers[3].value.should.eql('start');
      lexers[4].type.should.eql('END');
    });

    it('Hea01 1000000z (Bad)', () => {
      const lexers = lexer('Hea01 1000000z');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('1000000');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 I will pay 100k (Bad)', () => {
      const lexers = lexer('Hea01 I will pay 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('100k');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 bid 100k (Bad)', () => {
      const lexers = lexer('Hea01 bid 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('PRICE');
      lexers[1].value.should.eql('100k');
      lexers[2].type.should.eql('END');
    });

    it('Hea01 and Hea02, bid 100k', () => {
      const lexers = lexer('Hea01 and Hea02, bid 100k');

      lexers[0].type.should.eql('NAME');
      lexers[0].value.should.eql('Hea01');
      lexers[1].type.should.eql('NAME');
      lexers[1].value.should.eql('Hea02');
      lexers[2].type.should.eql('PRICE');
      lexers[2].value.should.eql('100k');
      lexers[3].type.should.eql('END');
    });
  });

  describe('Parser', () => {
    it('Hea12 150.2k', () => {
      const results = parse('Hea12 150.2k');

      results.should.eql({
        Hea12: '150.2k'
      });
    });

    it('Sta01 100m', () => {
      const results = parse('Sta01 100m');

      results.should.eql({
        Sta01: '100m'
      });
    });

    it('Sta01 start', () => {
      const results = parse('Sta01 start');

      results.should.eql({
        Sta01: 'start'
      });
    });

    it('[Hea01] 1000k', () => {
      const results = parse('[Hea01] 1000k');

      results.should.eql({
        Hea01: '1000k'
      });
    });

    it('Hea01 1000000', () => {
      const results = parse('Hea01 1000000');

      results.should.eql({
        Hea01: '1000000'
      });
    });

    it('Hea01 1,000,000', () => {
      const results = parse('Hea01 1,000,000');

      results.should.eql({
        Hea01: '1,000,000'
      });
    });

    it('Hea01 1000000c', () => {
      const results = parse('Hea01 1000000c');

      results.should.eql({
        Hea01: '1000000'
      });
    });

    it('I want Hea01 1m', () => {
      const results = parse('I want Hea01 1m');

      results.should.eql({
        Hea01: '1m'
      });
    });

    it('hea01 1m', () => {
      const results = parse('hea01 1m');

      results.should.eql({
        hea01: '1m'
      });
    });

    it('Hea01 Hea02 Hea03 100k', () => {
      const results = parse('Hea01 Hea02 Hea03 100k');

      results.should.eql({
        Hea01: '100k',
        Hea02: '100k',
        Hea03: '100k'
      });
    });

    it('[Hea01] [Hea02] [Hea03] 100k', () => {
      const results = parse('[Hea01] [Hea02] [Hea03] 100k');

      results.should.eql({
        Hea01: '100k',
        Hea02: '100k',
        Hea03: '100k'
      });
    });

    it('[Hea01][Hea02][Hea03] 100k', () => {
      const results = parse('[Hea01][Hea02][Hea03] 100k');

      results.should.eql({
        Hea01: '100k',
        Hea02: '100k',
        Hea03: '100k'
      });
    });

    it('Hea01\\nHea02\\nHea03\\n100k', () => {
      const results = parse('Hea01\nHea02\nHea03\n100k');

      results.should.eql({
        Hea01: '100k',
        Hea02: '100k',
        Hea03: '100k'
      });
    });

    it('Hea01\\nHea02\\nHea03\\nstart', () => {
      const results = parse('Hea01\nHea02\nHea03\nstart');

      results.should.eql({
        Hea01: 'start',
        Hea02: 'start',
        Hea03: 'start'
      });
    });

    it('Hea01 1000000z (Bad)', () => {
      const results = parse('Hea01 1000000z');

      results.should.eql({
        Hea01: '1000000'
      });
    });

    it('Hea01 I will pay 100k (Bad)', () => {
      const results = parse('Hea01 I will pay 100k');

      results.should.eql({
        Hea01: '100k'
      });
    });

    it('Hea01 bid 100k (Bad)', () => {
      const results = parse('Hea01 bid 100k');

      results.should.eql({
        Hea01: '100k'
      });
    });

    it('Hea01 and Hea02, bid 100k', () => {
      const results = parse('Hea01 and Hea02, bid 100k');

      results.should.eql({
        Hea01: '100k',
        Hea02: '100k'
      });
    });
  });
});
