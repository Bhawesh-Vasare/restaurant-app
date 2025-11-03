import { useEffect, useState } from "react";
import Restaurants from "./Restaurants";
import Orders from "./Orders";
import PaymentMethods from "./PaymentMethods";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1>Welcome {user.name} 🎉</h1>
      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
        Logout
      </button>

      <h2 className="mt-4 text-xl font-bold">Restaurants</h2>
      <Restaurants user={user} />

      <h2 className="mt-4 text-xl font-bold">Orders</h2>
      <Orders user={user} />

      {user.role === "admin" && (
        <>
          <h2 className="mt-4 text-xl font-bold">Payment Methods</h2>
          <PaymentMethods user={user} />
        </>
      )}
    </div>
  );
}
