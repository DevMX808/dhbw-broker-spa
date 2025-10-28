export interface MarketSymbolDto { name: string; symbol: string; }
export interface MarketQuoteDto  {
  name: string; price: number; symbol: string; updatedAt: string; updatedAtReadable: string;
  changePct?: number;
  change1mPct?: number;
}

export interface MarketSymbol { name: string; symbol: string; }
export interface MarketQuote  { name: string; symbol: string; priceUsd: number; updatedAt: Date; changePct?: number; }

export function mapSymbol(dto: MarketSymbolDto): MarketSymbol {
  return { name: dto.name, symbol: dto.symbol };
}
export function mapQuote(dto: MarketQuoteDto): MarketQuote {
  const change = dto.changePct ?? dto.change1mPct;
  return {
    name: dto.name,
    symbol: dto.symbol,
    priceUsd: dto.price,
    updatedAt: new Date(dto.updatedAt),
    changePct: typeof change === 'number' ? change : undefined
  };
}
