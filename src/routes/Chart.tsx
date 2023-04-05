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
  name: object;
}

function Chart() {
  const { coinID, name } = useOutletContext<ICoinProps>();
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
        <title>{`${name}'s`} Chart</title>
      </Helmet>
      {isLoading ? (
        "차트 불러오는중..."
      ) : (
        <ReactApexChart
          type="line"
          series={[
            {
              name: "sales",
              data: data?.map((price) => parseFloat(price.close)) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: "dark",
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
              show: true,
              labels: {
                formatter: (value) => `$${value.toFixed(1)}`,
              },
            },
            xaxis: {
              axisBorder: { show: true },
              axisTicks: { show: false },
              labels: { show: true },
              type: "datetime",
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toISOString()
              ),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#35d48a"], stops: [0, 100] },
            },
            colors: ["#06a9e4"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
