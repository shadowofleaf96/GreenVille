import PropTypes from "prop-types";
import { fShortenNumber } from "../../../utils/format-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppWidgetSummary({
  title,
  total,
  icon,
  currency,
  color = "#8DC63F",
  className,
  ...other
}) {
  return (
    <Card
      className={`
        overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
        border border-gray-100 bg-white shadow-sm
        w-full group rounded-3xl
        ${className}
      `}
      {...other}
    >
      <CardContent className="pt-8 pb-6 flex flex-col items-center justify-center text-center space-y-4">
        <div
          className="p-4 rounded-2xl transition-transform duration-500 group-hover:rotate-12"
          style={{
            backgroundColor: `${color}10`, // 10% opacity hex
            color: color,
          }}
        >
          <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {fShortenNumber(total)} {currency && ` ${currency}`}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 opacity-80">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  className: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  currency: PropTypes.string,
};
