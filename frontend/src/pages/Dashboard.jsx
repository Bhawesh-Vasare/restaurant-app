import { useEffect, useState } from "react";
import Home from "./Home";
import Orders from "./Orders";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []); // IMPORTANT -> [] dependency to prevent infinite loop!

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1>Welcome {user.name} 🎉</h1>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="bg-red-600 text-white px-3 py-1 rounded mt-3"
      >
        Logout
      </button>

      <h2 className="mt-4 text-xl font-bold">Restaurants</h2>
      <Home user={user} />

      <h2 className="mt-4 text-xl font-bold">Orders</h2>
      <Orders user={user} />
    </div>
  );
}
