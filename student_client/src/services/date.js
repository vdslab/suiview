export const convertDate = (input, flag) => {
  if (input === null) {
    return "";
  }
  const d = new Date(input);
  let createdDay = d.toLocaleString("ja-JP").slice(0, -3);
  if (createdDay === "Invalid D") {
    return input;
  }
  if (flag === 1) {
    createdDay = d.toLocaleString("ja-JP").slice(10, -3);
  }
  return createdDay;
};
