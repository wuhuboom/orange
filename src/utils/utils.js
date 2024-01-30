export const getImg = (file, name) => {
  return new URL(`../assets/images/${file}/${name}.webp`, import.meta.url).href;
};
