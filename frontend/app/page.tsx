"use client";
import React, { useEffect, useState } from "react";
import { get } from "../server/users";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const users = await get();
      setData(users);
    }
    fetchData();
  }, []);

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
