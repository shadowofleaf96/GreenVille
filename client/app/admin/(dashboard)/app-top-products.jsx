import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Scrollbar from "@/admin/_components/scrollbar";

export default function AppTopProducts({ title, subheader, list, ...other }) {
  return (
    <Card
      className="shadow-sm border border-gray-100 bg-white overflow-hidden rounded-3xl h-full flex flex-col"
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

      <CardContent className="p-0">
        <Scrollbar>
          <div className="overflow-x-auto text-nowrap">
            <table className="w-full text-left border-collapse">
              <tbody>
                {list.map((product) => (
                  <ProductTableRow key={product._id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

AppTopProducts.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

function ProductTableRow({ product }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 min-w-[200px]">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12 rounded-lg bg-gray-50 shrink-0">
            <AvatarImage
              src={product.image}
              alt={product.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">
              {product.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {product.name}
            </span>
            <span className="text-xs font-medium text-primary">
              {product.price} {"DH"}
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="flex flex-col items-end whitespace-nowrap">
          <span className="text-sm font-bold text-gray-800">
            {product.totalSold} {product.totalSold > 1 ? "units" : "unit"}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Sold
          </span>
        </div>
      </td>
    </tr>
  );
}

ProductTableRow.propTypes = {
  product: PropTypes.object,
};

