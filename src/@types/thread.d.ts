import { ParseBidResults ***REMOVED*** from '../lib/tokenizer';

export namespace Forum {
  export interface Reply {
    postId: string
    postLink: string
    username: string
    content: string
    isEdited: boolean
    date: string
    timestamp: number
    bid: ParseBidResults
  ***REMOVED***
***REMOVED***

export namespace Bid {
  export interface BidInfo {
    postId: string
    postLink: string
    username: string
    isEdited: boolean
    date: string
    timestamp: number
    price: number | 'start' | 'cancel' | null
  ***REMOVED***

  export interface BidsMap {
    [key: string]: BidInfo[]
  ***REMOVED***

  export interface CurrentBidWinners {
    [key: string]: BidInfo
  ***REMOVED***
***REMOVED***
