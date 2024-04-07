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
// 根据时间戳判断是上午还是下午
export const getAmOrPm = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour < 12 ? "AM" : "PM";
};

// 获取月份英文简写
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
export const getAmount = (money) => {
  let res = (Number(money) / window?.config?.UNIFIED_NUMBER).toFixed(4);
  return Number(res);
};
// 获取百分比
export const getPercent = (numSuc, numCount) => {
  let percent = "";
  if (numSuc / numCount === 1) {
    percent = 100;
  } else {
    percent = (numSuc / numCount * 100).toFixed(2);
  }
  return `${percent}%`;
};
//格式化金额
export const fomarNoney = (num) => {
  let res = (Number(num) / window?.config?.UNIFIED_NUMBER).toFixed(2);
  return Number(res);
};
export const fomarUsdt = (num) => {
  let res = (Number(num) / window?.config?.USDT_NUMBER).toFixed(2);
  return Number(res);
};

export const checkPwd = (pwd) => {
    //必须包含数字和字母
    let res = /^[a-zA-Z0-9]{8,20}$/
    return res.test(pwd)
}
export const checkName = (name)=>{
  let res = /^[a-zA-Z0-9_]+$/
  return res.test(name)
}