import { memo } from "react";
import ApexChart from "react-apexcharts";

import { bgBlur } from "@/utils/css-utils";

// ----------------------------------------------------------------------

const Chart = (props) => {
  const { sx, ...other } = props;

  const styles = (
    <style>{`
      .apexcharts-canvas .apexcharts-tooltip {
        ${Object.entries(bgBlur({ color: "#FFFFFF", opacity: 0.8 }))
          .map(
            ([k, v]) =>
              `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${v};`
          )
          .join(" ")}
        color: #212B36;
        box-shadow: 0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24);
        border-radius: 10px;
        border: none;
      }
      .apexcharts-canvas .apexcharts-xaxistooltip {
         ${Object.entries(bgBlur({ color: "#FFFFFF", opacity: 0.8 }))
           .map(
             ([k, v]) =>
               `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${v};`
           )
           .join(" ")}
        border-color: transparent;
        color: #212B36;
        box-shadow: 0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24);
        border-radius: 10px;
      }
      .apexcharts-canvas .apexcharts-xaxistooltip:before {
        border-bottom-color: rgba(145, 158, 171, 0.24);
      }
      .apexcharts-canvas .apexcharts-xaxistooltip:after {
        border-bottom-color: rgba(255, 255, 255, 0.8);
      }
      .apexcharts-canvas .apexcharts-tooltip-title {
        text-align: center;
        font-weight: 700;
        background-color: rgba(145, 158, 171, 0.08);
        color: #637381;
      }
      .apexcharts-canvas .apexcharts-legend {
        padding: 0;
      }
      .apexcharts-canvas .apexcharts-legend-series {
        display: inline-flex !important;
        align-items: center;
      }
      .apexcharts-canvas .apexcharts-legend-marker {
        margin-right: 8px;
      }
      .apexcharts-canvas .apexcharts-legend-text {
        line-height: 18px;
        text-transform: capitalize;
      }
    `}</style>
  );

  return (
    <div style={{ position: "relative", ...sx }}>
      {styles}
      <ApexChart {...other} />
    </div>
  );
};

export default memo(Chart);
