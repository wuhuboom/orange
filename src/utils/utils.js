import moment from "moment";

export const getImg = (file, name) => {
  return new URL(`../assets/images/${file}/${name}.webp`, import.meta.url).href;
};
export const formatDate = (date, type = "YYYY-MM-DD HH:mm:ss") => {
  let formattedDate = moment(date).format(type);
  return formattedDate;
};
export const getSplitName = (name) => {
  if (name != "") {
    const index = name.indexOf("("); // 查找第一个 "(" 的位置
    if (index !== -1) {
      name = name.slice(0, index); // 截取 "(" 之前的内容
    }
  }
  return name;
};
export const getAmOrPm = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour < 12 ? "AM" : "PM";
};

export const getENMonth = (timestamp) => {
  // 假设时间戳为 timestamp
  let monthObj = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  // const day = date.getDate();
  return monthObj[month];
};
