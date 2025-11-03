User.create!(email: "admin@example.com", password: "password", name: "Admin", role: :admin, country: "India")
User.create!(email: "manager@example.com", password: "password", name: "Manager", role: :manager, country: "India")
u = User.create!(email: "member@example.com", password: "password", name: "Member", role: :member, country: "India")

r1 = Restaurant.create!(name: "Spice House", country: "India", address: "Indore")
r1.menu_items.create!(name: "Paneer Masala", price: 8.99)
r2 = Restaurant.create!(name: "NY Bites", country: "America", address: "NYC")
r2.menu_items.create!(name: "Cheese Burger", price: 10.99)




# America users
User.create!(email: "us_admin@example.com", password: "password", name: "US Admin", role: :admin, country: "America")

