import merge from "lodash/merge";

import { palette as getPalette } from "../../../theme/palette";
import { typography } from "../../../theme/typography";
import { alpha } from "../../../theme/css";
import { useResponsive } from "../../hooks/use-responsive";

// ----------------------------------------------------------------------

export default function useChart(options) {
  const palette = getPalette();
  const smUp = useResponsive("up", "sm");

  const LABEL_TOTAL = {
    show: true,
    label: "Total",
    color: palette.text.secondary,
    fontSize: typography.subtitle2.fontSize,
    fontWeight: typography.subtitle2.fontWeight,
    lineHeight: typography.subtitle2.lineHeight,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: palette.text.primary,
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    lineHeight: typography.h3.lineHeight,
  };

  const baseOptions = {
    // Colors
    colors: [
      palette.primary.main,
      palette.secondary.main,
      palette.warning.main,
      palette.info.main,
      palette.error.main,
      palette.success.main,
      palette.warning.dark,
      palette.success.darker,
      palette.info.dark,
      palette.info.darker,
    ],

    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: palette.text.disabled,
      fontFamily: typography.fontFamily,
    },

    // States
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.04,
        },
      },
      active: {
        filter: {
          type: "darken",
          value: 0.88,
        },
      },
    },

    // Fill
    fill: {
      opacity: 1,
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    // Datalabels
    dataLabels: {
      enabled: false,
    },

    // Stroke
    stroke: {
      width: 3,
      curve: "smooth",
      lineCap: "round",
    },

    // Grid
    grid: {
      strokeDashArray: 3,
      borderColor: palette.divider,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    // Xaxis
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    // Markers
    markers: {
      size: 0,
      strokeColors: palette.background.paper,
    },

    // Tooltip
    tooltip: {
      theme: false,
      x: {
        show: true,
      },
    },

    // Legend
    legend: {
      show: true,
      fontSize: 13,
      position: "top",
      horizontalAlign: "right",
      markers: {
        radius: 12,
      },
      fontWeight: 500,
      itemMargin: {
        horizontal: 8,
      },
      labels: {
        colors: palette.text.primary,
      },
    },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        borderRadius: smUp ? 3 : 1,
        columnWidth: "28%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },

      // Pie + Donut
      pie: {
        donut: {
          labels: {
            show: true,
            value: LABEL_VALUE,
            total: LABEL_TOTAL,
          },
        },
      },

      // Radialbar
      radialBar: {
        track: {
          strokeWidth: "100%",
          background: alpha(palette.grey[500], 0.16),
        },
        dataLabels: {
          value: LABEL_VALUE,
          total: LABEL_TOTAL,
        },
      },

      // Radar
      radar: {
        polygons: {
          fill: { colors: ["transparent"] },
          strokeColors: palette.divider,
          connectorColors: palette.divider,
        },
      },

      // polarArea
      polarArea: {
        rings: {
          strokeColor: palette.divider,
        },
        spokes: {
          connectorColors: palette.divider,
        },
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        breakpoint: 600,
        options: {
          plotOptions: { bar: { columnWidth: "40%" } },
        },
      },
      {
        // md
        breakpoint: 900,
        options: {
          plotOptions: { bar: { columnWidth: "32%" } },
        },
      },
    ],
  };

  return merge(baseOptions, options);
}
