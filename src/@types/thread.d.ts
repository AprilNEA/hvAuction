import { ParseBidResults } from '../lib/bid/tokenizer';

export namespace Forum {
  export interface Reply {
    postId: string
    $id: string
    postLink: string
    username: string
    content: string
    isEdited: boolean
    date: string
    timestamp: number
    bid: ParseBidResults
  }
}

export namespace Bid {
  export interface BidInfo {
    postId: string
    postLink: string
    username: string
    isEdited: boolean
    date: string
    timestamp: number
    price: number | 'start' | 'cancel' | null
  }

  export interface BidsMap {
    [key: string]: BidInfo[]
  }

  export interface CurrentBidWinners {
    [key: string]: BidInfo
  }
}
