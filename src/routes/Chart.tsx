import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinsHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import { Helmet } from "react-helmet-async";

interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface ICoinProps {
  coinID: string;
  coinName: object;
}

interface IChart {
  isDark: boolean;
}

function Chart() {
  const { coinID, coinName } = useOutletContext<ICoinProps>();
  console.log(coinID, coinName)
  const { isDark } = useOutletContext<IChart>();
  const { isLoading, data } = useQuery<IHistory[]>(
    ["ohlcv", coinID],
    () => fetchCoinsHistory(coinID),
    {
      refetchInterval: 10000,
    }
  );
  return (
    <div>
      <Helmet>
        <title>{`${coinName}'s`} Chart</title>
      </Helmet>
      {isLoading ? (
        "차트 불러오는중..."
      ) : (
        <>
        {/* 일반점선 차트 */}
          <ReactApexChart
            type="line"
            height="200px"
            series={[
              {
                name: "가격",
                data: data?.map((price) => parseFloat(price.close)) ?? [],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "light" : "dark",
              },
              chart: {
                height: 500,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 4,
              },
              yaxis: {
                show: false,
                labels: {
                  formatter: (value) => `$${value.toFixed(1)}`,
                },
              },
              xaxis: {
                axisBorder: { show: true },
                axisTicks: { show: false },
                labels: { show: false },
                type: "datetime",
                categories: data?.map((price) =>
                  new Date(price.time_close * 1000).toISOString()
                ),
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#00afea"], stops: [0, 100] },
              },
              colors: ["#a9b9e4"],
              tooltip: {
                y: {
                  formatter: (value) => `$${value.toFixed(2)}`,
                },
              },
            }}
          />
          {/* 캔들스틱 차트 */}
          <ReactApexChart
            type="candlestick"
            width="100%"
            height="160px"
            options={{
              chart: {
                background: "transparent",
                fontFamily: '"Pretendard", sans-serif',
                height: 300,
                toolbar: {
                  show: false,
                },
                width: 500,
              },
              fill: { opacity: 0 },
              grid: { show: false },
              noData: { text: "" },
              plotOptions: {
                candlestick: {
                  colors: {
                    downward: "#1bbf65",
                    upward: "#e7214f",
                  },
                  wick: { useFillColor: true },
                },
              },
              stroke: { width: 2 },
              theme: {
                mode: "dark",
                palette: "palette1",
              },
              tooltip: {
                theme: "dark",
                y: {
                  formatter: (value) => `$${value.toFixed(2)}`,
                },
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                categories: data?.map(
                  (price) => new Date(price.time_close * 1000)
                ),
                labels: { show: false },
                tooltip: { enabled: false },
                type: "datetime",
              },
              yaxis: {
                labels: { show: false },
              },
            }}
            series={
              [
                {
                  name: "시세",
                  data: data?.map((price) => {
                    return {
                      x: new Date(price.time_close),
                      y: [price.open, price.high, price.low, price.close],
                    };
                  }),
                },
              ] as unknown as number[]
            }
          />
        </>
      )}
    </div>
  );
}

export default Chart;
