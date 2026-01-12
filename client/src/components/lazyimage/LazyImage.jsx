import React, { useState } from "react";
import { motion } from "framer-motion";

const LazyImage = ({
  src,
  alt,
  className,
  style,
  placeholderClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-100 ${
            placeholderClassName || ""
          }`}
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }}
        />
      )}

      {/* Actual Image */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
