import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders for the logged-in user
  useEffect(() => {
    fetch("http://localhost:3000/api/orders", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const handleCancel = (orderId) => {
    fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`❌ Order #${orderId} canceled`);
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: "canceled" } : o
          )
        );
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to cancel order");
      });
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading orders...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        🛒 Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Order #{order.id}
              </h2>
              <p className="text-gray-600 mt-1">
                Restaurant: {order.restaurant_name || order.restaurant_id}
              </p>
              <p className="text-gray-600">Status: {order.status || "pending"}</p>
              <p className="text-gray-600">Total Price: ${order.total_price || 0}</p>

              <h3 className="font-semibold mt-3 mb-2">Items:</h3>
              <ul className="space-y-1">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} - ${item.subtotal}
                  </li>
                ))}
              </ul>

              {order.status !== "canceled" && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
