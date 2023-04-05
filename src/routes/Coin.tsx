import { useQuery } from "react-query";
import { Helmet } from "react-helmet-async";
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useMatch,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinsInfo, fetchCoinsTickers } from "../api";

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  a {
    color: ${(props) => props.theme.accentColor};
    position: absolute;
    left: 0;
    font-size: 24px;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  font-weight: bold;
`;

const Loader = styled.div`
  text-align: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  a {
    display: block;
    color: ${(props) =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
  }
`;

// interface 선언할때 : console.log로 불러온 데이터를 전역변수로 object에 저장 -> temp1, temp2, ...
// console.log(Object.entries(temp2).map(a => `${a[0]}: ${typeof a[1]};`).join("\r\n"))
interface infoData {
  //interface는 구분용으로 변수맨앞에 대문자 i를 붙여줌
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface priceData {
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

function Coin() {
  const { coinID } = useParams();
  const location = useLocation();
  const priceMatch = useMatch(`/${coinID}/price`);
  const chartMatch = useMatch(`/${coinID}/chart`);

  const { isLoading: infoLoading, data: infoData } = useQuery<infoData>(
    ["coins", coinID],
    () => fetchCoinsInfo(coinID!)
  ); //coinID!에서 느낌표를 빼면 coinID의 type이 string | undefined로 인식돼 쿼리가 실행이 안된다.
  const { isLoading: tickersLoading, data: tickersData } = useQuery<priceData>(
    ["tickers", coinID],
    () => fetchCoinsTickers(coinID!),
    {
      refetchInterval: 5000,
    }
  );
  const name = infoData?.name;
  const isLoading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {location?.state
            ? location.state
            : isLoading
            ? "Loading..."
            : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Link to={"/"}>&larr;</Link>
        <Title>
          {location?.state
            ? location.state
            : isLoading
            ? "Loading..."
            : infoData?.name}
        </Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{`$${tickersData?.quotes.USD.price.toFixed(2)}`}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinID}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinID}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinID, name }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
