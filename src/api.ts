const BASE_URL = "https://api.coinpaprika.com/v1";

export function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

export function fetchCoinsInfo(coinID: string) {
  return fetch(`${BASE_URL}/coins/${coinID}`).then((response) => response.json());
}

export function fetchCoinsTickers(coinID: string) {
  return fetch(`${BASE_URL}/tickers/${coinID}`).then((response) => response.json());
}

export function fetchCoinsHistory(coinID: string) {
  return fetch(`https://ohlcv-api.nomadcoders.workers.dev/?coinId=${coinID}`).then((response) => response.json());
}
