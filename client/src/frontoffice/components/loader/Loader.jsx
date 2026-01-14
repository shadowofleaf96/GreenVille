import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import LazyImage from "../../../components/lazyimage/LazyImage";

const Loader = () => {
  const { data: settings } = useSelector((state) => state.adminSettings);

  const logoUrl = settings?.logo_url
    ? `${settings.logo_url}`
    : "/assets/logo.webp";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Decorative Background Element */}
        <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full" />

        {/* Animated Logo Container */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <LazyImage
            src={logoUrl}
            alt="Loading..."
            className="w-[150px] h-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Loading Bar (Optional but looks premium) */}
        {/* <div className="mt-8 w-24 h-1 bg-gray-100 rounded-full overflow-hidden relative z-10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Loader;
