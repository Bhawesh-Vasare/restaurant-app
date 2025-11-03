class RestaurantSerializer < ActiveModel::Serializer
  attributes :id, :name, :address, :country
  has_many :menu_items
end