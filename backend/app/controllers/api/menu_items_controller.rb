menu_items
module Api
  class MenuItemsController < ApplicationController
    skip_before_action :authenticate_user_from_token!, only: [:create]
    

    def create
      user = User.find_for_authentication(email: params[:email])
      if user&.valid_password?(params[:password])
        user.regenerate_authentication_token if user.authentication_token.blank?
        render json: { token: user.authentication_token, user: user }
      else
        render json: { error: 'Invalid credentials' }, status: :unauthorized
      end
    end
  end
end
