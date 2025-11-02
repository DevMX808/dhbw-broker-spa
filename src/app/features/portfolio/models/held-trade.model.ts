export interface HeldTrade {
  id: number;
  tradeId: number;
  assetSymbol: string;
  assetName?: string;
  quantity: number;
  buyPriceUsd: number;
  createdAt: string;
}
