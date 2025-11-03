import React, { useEffect, useState } from "react";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurants from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurants:", err);
        setLoading(false);
      });
  }, []);

  // Handle placing an order
  const handleOrder = (menuItem, restaurantId) => {
    const payload = {
      order: {
        restaurant_id: restaurantId,
        order_items_attributes: [
          {
            menu_item_id: menuItem.id,
            quantity: 1, // default quantity
            subtotal: menuItem.price,
          },
        ],
      },
    };

    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          alert("❌ Failed to create order: " + data.errors.join(", "));
        } else {
          alert(`✅ Order created for ${menuItem.name}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to create order");
      });
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        🍽️ Welcome to Food Ordering App
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {restaurant.name}
            </h2>
            <p className="text-gray-600 mt-2">Country: {restaurant.country}</p>
            <p className="text-gray-600 mb-2">Address: {restaurant.address}</p>

            <h3 className="font-semibold mt-3 mb-2">Menu Items:</h3>
            <ul className="space-y-2">
              {restaurant.menu_items?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>
                    {item.name} - ${item.price}
                  </span>
                  <button
                    onClick={() => handleOrder(item, restaurant.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Order Now
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
