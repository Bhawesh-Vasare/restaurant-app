class Order < ApplicationRecord
  belongs_to :user
  belongs_to :restaurant
  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items
  
  enum status: { pending: 0, paid: 1, canceled: 2 }

  before_save :calculate_total

  private

  def calculate_total
    self.total_price = order_items.sum(&:subtotal)
    self.status ||= :pending
  end
end
