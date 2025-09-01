export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1394,
  JPY: 9.42,
};

export const convertToKRW = (price: number, currency: string): number => {
  const upperCaseCurrency = currency.toUpperCase();
  if (upperCaseCurrency === 'KRW') {
    return price;
  }
  const rate = EXCHANGE_RATES[upperCaseCurrency];
  return rate ? Math.round(price * rate) : 0;
};
