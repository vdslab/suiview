export const convertDate = (input, flag) => {
  if (input === null) {
    return "";
  }
  const d = new Date(input);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  let createdDay = year + "/" + month + "/" + date + " " + hour + ":" + minute;
  if (createdDay === "NaN/NaN/NaN NaN:NaN") {
    return input;
  }
  if (flag === 1) {
    createdDay = hour + ":" + minute;
  }
  return createdDay;
};
