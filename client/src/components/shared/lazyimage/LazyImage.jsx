import { useState } from "react";
import { motion } from "framer-motion";

const LazyImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  style,
  placeholderClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`${wrapperClassName || "relative"}`} style={style}>
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-100 ${
            placeholderClassName || ""
          }`}
          style={{
            zIndex: 1,
            background:
              "linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }}
        />
      )}

      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        src={src}
        alt={alt}
        className={`block ${className || ""}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
