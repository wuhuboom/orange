import moment from "moment";

export const getImg = (file, name) => {
  return new URL(`../assets/images/${file}/${name}.webp`, import.meta.url).href;
};
export const formatDate = (date, type = "YYYY-MM-DD HH:mm:ss") => {
  let formattedDate = moment(date).format(type);
  return formattedDate;
};
