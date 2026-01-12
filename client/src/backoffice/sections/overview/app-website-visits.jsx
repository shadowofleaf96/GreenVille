import PropTypes from "prop-types";
import Chart, { useChart } from "../../components/chart";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AppWebsiteVisits({
  title,
  subheader,
  chart,
  ...other
}) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: "16%",
      },
    },
    fill: {
      type: series.map((i) => i.fill || "gradient"),
      gradient: {
        type: "vertical",
        shadeIntensity: 0.1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    labels,
    xaxis: {
      type: "date",
      labels: {
        style: {
          colors: "#919EAB",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.floor(value),
        style: {
          colors: "#919EAB",
          fontWeight: 600,
        },
      },
      tickAmount: 5,
      min: 0,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "rgba(145, 158, 171, 0.1)",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => value,
      },
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
    },
    ...options,
  });

  return (
    <Card
      className="shadow-sm border border-gray-100 bg-white overflow-hidden rounded-3xl"
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

      <CardContent className="pt-4">
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </CardContent>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
