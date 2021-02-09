export async function getUsers() {
  const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`);
  return response.json();
}
