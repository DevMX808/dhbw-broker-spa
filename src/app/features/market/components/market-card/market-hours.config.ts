export enum AssetType {
  PRECIOUS_METAL = 'PRECIOUS_METAL',
  CRYPTO = 'CRYPTO'
}

export interface MarketHours {
  assetType: AssetType;
  isOpen: (date: Date) => boolean;
}

export const ASSET_TYPE_MAP: Record<string, AssetType> = {
  'XAU': AssetType.PRECIOUS_METAL,
  'XAG': AssetType.PRECIOUS_METAL,
  'XPD': AssetType.PRECIOUS_METAL,
  'HG': AssetType.PRECIOUS_METAL,

  'BTC': AssetType.CRYPTO,
  'ETH': AssetType.CRYPTO
};

function toEST(date: Date): Date {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utcTime - (5 * 3600000));
}

function isPreciousMetalMarketOpen(date: Date): boolean {
  const estDate = toEST(date);
  const day = estDate.getDay();
  const hours = estDate.getHours();
  const minutes = estDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  if (day === 6) {
    return false;
  }

  if (day === 0) {
    return timeInMinutes >= 18 * 60;
  }

  if (day === 5) {
    return timeInMinutes < 17 * 60;
  }

  if (day >= 1 && day <= 4) {
    return !(timeInMinutes >= 17 * 60 && timeInMinutes < 18 * 60);

  }

  return false;
}

function isCryptoMarketOpen(_date: Date): boolean {
  return true;
}

export const MARKET_HOURS: Record<AssetType, MarketHours> = {
  [AssetType.PRECIOUS_METAL]: {
    assetType: AssetType.PRECIOUS_METAL,
    isOpen: isPreciousMetalMarketOpen
  },
  [AssetType.CRYPTO]: {
    assetType: AssetType.CRYPTO,
    isOpen: isCryptoMarketOpen
  }
};

export function isMarketOpen(symbol: string, date: Date = new Date()): boolean {
  const assetType = ASSET_TYPE_MAP[symbol];

  if (!assetType) {
    return false;
  }

  const marketHours = MARKET_HOURS[assetType];
  return marketHours.isOpen(date);
}

export function getAssetType(symbol: string): AssetType | undefined {
  return ASSET_TYPE_MAP[symbol];
}

export interface NextOpeningTime {
  opensAt: Date;
  description: string;
}

export function getNextOpeningTime(symbol: string, currentDate: Date = new Date()): NextOpeningTime | null {
  const assetType = ASSET_TYPE_MAP[symbol];

  if (!assetType || assetType === AssetType.CRYPTO) {
    return null;
  }

  if (assetType === AssetType.PRECIOUS_METAL) {
    return getNextPreciousMetalOpeningTime(currentDate);
  }

  return null;
}

function getNextPreciousMetalOpeningTime(currentDate: Date): NextOpeningTime {
  const estDate = toEST(currentDate);
  const day = estDate.getDay();
  const hours = estDate.getHours();
  const minutes = estDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  if (day === 6) {
    const nextOpening = new Date(estDate);
    nextOpening.setDate(nextOpening.getDate() + 1);
    nextOpening.setHours(18, 0, 0, 0);
    return {
      opensAt: fromEST(nextOpening),
      description: 'Sonntag um 18:00 EST'
    };
  }

  if (day === 0) {
    if (timeInMinutes < 18 * 60) {
      const nextOpening = new Date(estDate);
      nextOpening.setHours(18, 0, 0, 0);
      return {
        opensAt: fromEST(nextOpening),
        description: 'Heute um 18:00 EST'
      };
    }
  }

  if (day === 5) {
    if (timeInMinutes >= 17 * 60) {
      const nextOpening = new Date(estDate);
      nextOpening.setDate(nextOpening.getDate() + 2);
      nextOpening.setHours(18, 0, 0, 0);
      return {
        opensAt: fromEST(nextOpening),
        description: 'Sonntag um 18:00 EST'
      };
    }
  }

  if (day >= 1 && day <= 4) {
    if (timeInMinutes >= 17 * 60 && timeInMinutes < 18 * 60) {
      const nextOpening = new Date(estDate);
      nextOpening.setHours(18, 0, 0, 0);
      return {
        opensAt: fromEST(nextOpening),
        description: 'Heute um 18:00 EST'
      };
    }
  }

  return {
    opensAt: currentDate,
    description: 'Markt ist geöffnet'
  };
}

function fromEST(estDate: Date): Date {
  return new Date(estDate.getTime() + (5 * 3600000) - (estDate.getTimezoneOffset() * 60000));
}
