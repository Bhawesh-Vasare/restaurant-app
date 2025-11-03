class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


          has_secure_token :authentication_token
          enum role: { member: 0, manager: 1, admin: 2 }

          has_many :orders,dependent: :destroy
          has_many :payment_methods
          validates :name, presence: true
end
