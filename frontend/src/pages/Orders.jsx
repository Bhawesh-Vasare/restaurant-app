import React, { useEffect, useState } from "react";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = user?.role;

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
    if (role !== "member") {
      alert("❌ Only members can cancel orders!");
      return;
    }

    fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then(() => {
        alert(`❌ Order #${orderId} canceled`);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "canceled" } : o
          )
        );
      })
      .catch(() => alert("❌ Failed to cancel order"));
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (role !== "admin") {
      alert("⚠️ Only Admins can change status!");
      return;
    }

    fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`✅ Order #${orderId} marked as ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      })
      .catch(() => alert("❌ Failed to update status"));
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

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

              {/* MEMBER – can cancel */}
              {role === "member" && order.status !== "canceled" && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Cancel Order
                </button>
              )}

              {/* ADMIN – can change status */}
              {role === "admin" && (
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleStatusChange(order.id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, "delivered")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Mark Delivered
                  </button>
                </div>
              )}

              {/* MANAGER – read-only */}
              {role === "manager" && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  (View only – Manager access)
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
