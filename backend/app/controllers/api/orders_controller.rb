module Api
  class OrdersController < ApplicationController
    before_action :authenticate_user_from_token! 
    before_action :authorize_admin_or_manager!, only: [:cancel, :checkout]
    before_action :set_order, only: [:show, :cancel, :checkout]

    def create
      order = @current_user.orders.new(order_params)
      if order.save
        render json: order.as_json(include: :order_items), status: :created
      else
        render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      orders = if @current_user.admin? || @current_user.manager?
                 Order.includes(:order_items).all
               else
                 @current_user.orders.includes(:order_items)
               end

      render json: orders.as_json(include: :order_items)
    end
    
    def show
      render json: @order.as_json(include: :order_items)
    end

    def cancel
      @order.update!(status: :canceled)
      render json: { message: "Order canceled successfully", order: @order }
    end

    def checkout
      @order.update!(status: :paid)
      render json: { message: "Order paid successfully", order: @order }
    end

    private

    def set_order
      @order = if @current_user.admin? || @current_user.manager?
                 Order.find(params[:id])
               else
                 @current_user.orders.find(params[:id])
               end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Order not found" }, status: :not_found
    end

    def order_params
      params.require(:order).permit(:restaurant_id,
        order_items_attributes: [:menu_item_id, :quantity, :subtotal])
    end

    def authorize_admin!
      render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user.admin?
    end

    def authorize_admin_or_manager!
      render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user.admin? || @current_user.manager?
    end
  end
end
