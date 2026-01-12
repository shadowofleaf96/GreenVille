import PropTypes from "prop-types";
import { fNumber } from "../../../utils/format-number";
import Chart, { useChart } from "../../components/chart";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AppCurrentVisits({
  title,
  subheader,
  chart,
  ...other
}) {
  const { colors, series, options } = chart;
  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: {
      show: true,
      width: 2,
      colors: ["#FFFFFF"],
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      fontWeight: 600,
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      markers: {
        radius: 12,
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
      style: {
        fontWeight: 700,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "90%",
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card
      className="shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col rounded-3xl"
      {...other}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </CardTitle>
        {subheader && (
          <CardDescription className="text-gray-500 font-medium">
            {subheader}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="grow flex items-center justify-center pt-2">
        <div className="w-full relative" style={{ height: 400 }}>
          <Chart
            dir="ltr"
            type="pie"
            series={chartSeries}
            options={chartOptions}
            width="400px"
            height="400px"
          />
        </div>
      </CardContent>
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
