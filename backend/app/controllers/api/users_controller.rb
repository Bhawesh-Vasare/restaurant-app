module Api
  class UsersController < ApplicationController
    skip_before_action :authenticate_user_from_token!, only: [:create]

    def create
      user = User.new(user_params)
      if user.save
        user.regenerate_authentication_token
        render json: { user: user, token: user.authentication_token }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :name, :country, :password, :password_confirmation, :role)
    end
  end
end
