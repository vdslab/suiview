export const convertDate = (input) => {
  if (input === null) {
    return "";
  }
  const d = new Date(input);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const createdDay = year + "/" + month + "/" + date + "";
  return createdDay;
};
