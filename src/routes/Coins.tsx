import { useQuery } from "react-query";
import { Link, useOutletContext, } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet-async";

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
  flex-wrap: wrap;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  margin-bottom: 1rem;

  a {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.contentsColor};
    transition: color 0.2s ease-in-out;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    font-size: 1.5rem;

    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
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

const DarkToggle = styled.button`
  width: 210px;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: ${(props) => props.theme.backColor};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.textColor};
  border-radius: 1rem;
  margin-top: 0.5rem;
`;

interface ICoins {
  toggleMode: () => void;
  isDark: boolean;
}

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins);
  const {toggleMode, isDark} = useOutletContext<ICoins>();
  
  return (
    <Container>
      <Helmet>
        <title>떡상 가즈아</title>
      </Helmet>
      <Header>
        <Title>떡상 가즈아</Title>
        <DarkToggle onClick={toggleMode}>{!isDark ? "다크모드" : "라이트모드"}</DarkToggle>
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
