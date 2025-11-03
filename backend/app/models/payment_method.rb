class PaymentMethod < ApplicationRecord
  belongs_to :user

  validates :card_last4, :card_brand, presence: true
end
