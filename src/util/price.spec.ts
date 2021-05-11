import 'ts-mocha';
import chai from 'chai';
chai.should();

import { parsePrice } from './price';

describe('price parser', () => {
  it('15k', () => {
    parsePrice('15k')?.should.eql(15000);
  });

  it('150.2k', () => {
    parsePrice('150.2k')?.should.eql(150200);
  });

  it('200m', () => {
    parsePrice('200m')?.should.eql(200000000);
  });

  it('2m1k', () => {
    parsePrice('2m1k')?.should.eql(2000000);
  });

  it('2k1m', () => {
    parsePrice('2k1m')?.should.eql(2000);
  });

  it('big fox tail', () => {
    parsePrice('big fox tail')?.should.eql(null);
  });
});
