import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 0 20px;
  max-width: 360px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoinsList = styled.ul`
`;

const Coin = styled.li`
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 15px;

  a {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.backColor};
    transition: color 0.2s ease-in-out;
    padding: 10px;

    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.div`
  text-align: center;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const CoinImg = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>코인임</title>
      </Helmet>
      <Header>
        <Title>코인임</Title>
      </Header>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={`${coin.name}`}>
                <CoinImg
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
