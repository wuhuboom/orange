export const getImg = (file, name, fileType = "png") => {
  if (file === "login") {
    fileType = "webp";
  }
  return new URL(
    `../assets/images/${file}/${name}.${fileType}`,
    import.meta.url
  ).href;
};
