"use server"; //all of this will be server-side and not exposed client-side

interface User {
  email: string;
  id: string;
}

export const get = async (): Promise<User[]> => {
  const data = await fetch(`${process.env.APP_URL}/users`);
  const json = await data.json();
  return json.data;
};
