export interface HeldTrade {
  id: number;
  tradeId: number;
  assetSymbol: string;
  quantity: number;         // BigDecimal kann hier als number in TS
  buyPriceUsd: number;
  createdAt: string;        // ISO Datumsstring
}
