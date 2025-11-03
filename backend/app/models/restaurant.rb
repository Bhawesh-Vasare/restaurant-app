class Restaurant < ApplicationRecord
    scope :by_country, ->(country) { where(country: country) }

    has_many :menu_items, dependent: :destroy
    validates :name, :country, presence: true
end
