class MenuItem < ApplicationRecord
  belongs_to :restaurant
  validates :name, :price, presence: true
end
