module Api
  class RestaurantsController < ApplicationController
    before_action :authenticate_user_from_token!


    def index
      if current_user&.admin?
        restaurants = Restaurant.all
      else
        restaurants = Restaurant.where(country: current_user&.country)
      end
      render json: restaurants, include: :menu_items
    end

    def show
      restaurant = Restaurant.find(params[:id])
      if !current_user.admin? && restaurant.country != current_user.country
        render json: { error: "Not allowed" }, status: :forbidden and return
      end
      render json: restaurant, include: :menu_items
    end
  end
end
