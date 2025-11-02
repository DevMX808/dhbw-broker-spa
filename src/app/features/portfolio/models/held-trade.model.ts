export interface HeldTrade {
  id: number;
  tradeId: number;
  assetSymbol: string;
  quantity: number;
  buyPriceUsd: number;
  createdAt: string;
}
