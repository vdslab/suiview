export const convertDate = (input) => {
  if (input === null) {
    return "";
  }
  //console.log("input = " + input);
  //const d = new Date(`${input} UTC`);
  const d = new Date(input);
  //console.log(d);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  /* const createdDay =
      year + "/" + month + "/" + date + "/" + hour + ":" + minute;*/
  const createdDay = year + "/" + month + "/" + date + "/";
  return createdDay;
};
