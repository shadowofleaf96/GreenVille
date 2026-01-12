import PropTypes from "prop-types";
import { fDateTime } from "../../../utils/format-time";
import Scrollbar from "../../components/scrollbar";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AppRecentReviews({ title, subheader, list, ...other }) {
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
          <div className="p-6 space-y-6">
            {list.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

AppRecentReviews.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

function ReviewItem({ review }) {
  const { customer_id, rating, comment, review_date, product_id } = review;

  return (
    <div className="flex space-x-4">
      <Avatar className="w-12 h-12 border-2 border-white shadow-sm shrink-0">
        <AvatarImage
          src={customer_id?.customer_image}
          alt={customer_id?.first_name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-100">
          {customer_id?.first_name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="grow min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-800 truncate">
            {customer_id?.first_name} {customer_id?.last_name}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            {fDateTime(review_date)}
          </span>
        </div>

        <p className="text-xs font-bold text-primary mb-1 truncate">
          {product_id?.product_name?.en}
        </p>

        <div className="flex items-center space-x-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? "fill-current" : "text-gray-200"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">
            ({rating})
          </span>
        </div>

        <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-2">
          "{comment}"
        </p>
      </div>
    </div>
  );
}

ReviewItem.propTypes = {
  review: PropTypes.object,
};
