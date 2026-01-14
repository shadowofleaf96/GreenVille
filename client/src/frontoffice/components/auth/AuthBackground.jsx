import PropTypes from "prop-types";

const AuthBackground = ({ url, className }) => {
  const defaultVideo =
    "https://res.cloudinary.com/donffivrz/video/upload/f_auto:video,q_auto/v1/greenville/public/videos/qdbnvi7dzfw7mc4i1mt7";
  const finalUrl = url || defaultVideo;
  const defaultClasses = "fixed inset-0 w-full h-full object-cover -z-10";
  const finalClassName = className || defaultClasses;

  const isVideo =
    finalUrl.includes(".mp4") ||
    finalUrl.includes(".webm") ||
    !finalUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

  if (isVideo) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className={finalClassName}
        preload="auto"
      >
        <source src={finalUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <div className={finalClassName}>
      <img
        src={finalUrl}
        alt="Auth Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />{" "}
      {/* Subtle overlay for text readability */}
    </div>
  );
};

AuthBackground.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};

export default AuthBackground;
