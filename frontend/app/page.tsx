import { get } from "../server/users";

export default async function Home() {
  const data = await get();
  return (
    <div>
      <h1>Frontend</h1>
      <div>
        {data.map((user) => (
          <p key={user.id}>{user.email}</p>
        ))}
      </div>
    </div>
  );
}
