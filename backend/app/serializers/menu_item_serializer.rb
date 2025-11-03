class MenuItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :price
end
