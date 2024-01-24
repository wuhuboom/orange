
export const getImg = (file,name) => {
    return new URL(`../assets/images/${file}/${name}.png`, import.meta.url).href
};