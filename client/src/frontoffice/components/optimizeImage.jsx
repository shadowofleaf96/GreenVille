const optimizeImage = (imageUrl, size) => {
  if (!imageUrl) return '';

  const optimizedUrl = imageUrl.replace(
    /\/upload\//,
    `/upload/c_scale,w_${size},q_auto,f_auto/`
  );

  return optimizedUrl;
};

export default optimizeImage