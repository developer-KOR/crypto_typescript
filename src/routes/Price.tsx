import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinsTickers } from "../api";
import styled from "styled-components";

interface coinProps {
  coinID: string;
}

interface priceProps {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const PriceWrap = styled.ul`
  text-align: center;
`;

const PriceDetail = styled.li`
  margin-bottom: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.backColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  transition: color 0.2s ease-in-out;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-size: 1.5rem;
  box-sizing: border-box;
  color: ${(props) => props.theme.textColor};
`;

const PlusPrice = styled.p`
  color: #f01212;
`;

const MinusPrice = styled.p`
  color: #2421e2;
`;

function Price() {
  const { coinID } = useOutletContext<coinProps>();
  const { isLoading, data } = useQuery<priceProps>(
    ["Price", coinID],
    () => fetchCoinsTickers(coinID),
    {
      refetchInterval: 10000,
    }
  );
  
  return (
    <div>
      {isLoading ? (
        "가격 불러오는중..."
      ) : (
        <PriceWrap>
          <PriceDetail>
            현재 가격 :&nbsp;<strong>${data?.quotes.USD.price?.toFixed(2)}</strong>
          </PriceDetail>
          <PriceDetail>
            1시간 전보다 &nbsp; 
            {Number(data?.quotes.USD.percent_change_1h) > 0 ? (
              <PlusPrice>
                {data?.quotes.USD.percent_change_1h?.toFixed(2)}%▲
              </PlusPrice>
            ) : (
              <MinusPrice>
                {data?.quotes.USD.percent_change_1h?.toFixed(2)}%▼
              </MinusPrice>
            )}
          </PriceDetail>
          <PriceDetail>
            하루 전보다 &nbsp;  
            {Number(data?.quotes.USD.percent_change_24h) > 0 ? (
              <PlusPrice>
                {data?.quotes.USD.percent_change_24h?.toFixed(2)}%▲
              </PlusPrice>
            ) : (
              <MinusPrice>
                {data?.quotes.USD.percent_change_24h?.toFixed(2)}%▼
              </MinusPrice>
            )}
          </PriceDetail>
          <PriceDetail>
            1주 전보다 &nbsp;  
            {Number(data?.quotes.USD.percent_change_7d) > 0 ? (
              <PlusPrice>
                {data?.quotes.USD.percent_change_7d?.toFixed(2)}%▲
              </PlusPrice>
            ) : (
              <MinusPrice>
                {data?.quotes.USD.percent_change_7d?.toFixed(2)}%▼
              </MinusPrice>
            )}
          </PriceDetail>
          <PriceDetail>
            한달 전보다 &nbsp;  
            {Number(data?.quotes.USD.percent_change_30d) > 0 ? (
              <PlusPrice>
                {data?.quotes.USD.percent_change_30d?.toFixed(2)}%▲
              </PlusPrice>
            ) : (
              <MinusPrice>
                {data?.quotes.USD.percent_change_30d?.toFixed(2)}%▼
              </MinusPrice>
            )}
          </PriceDetail>
        </PriceWrap>
      )}
    </div>
  );
}

export default Price;
