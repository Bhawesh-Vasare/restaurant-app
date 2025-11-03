module Api
  class OrdersController < ApplicationController
    before_action :authenticate_user_from_token! 

    def create
      order = @current_user.orders.new(order_params)
      if order.save
        render json: order.as_json(include: :order_items), status: :created
      else
        render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      if @current_user.admin? || @current_user.manager?
        orders = Order.includes(:order_items).all
      else
        orders = @current_user.orders.includes(:order_items)
      end

      render json: orders.as_json(include: :order_items)
    end
    
    def show
      order = if @current_user.admin? || @current_user.manager?
                Order.includes(:order_items).find(params[:id])
              else
                @current_user.orders.includes(:order_items).find(params[:id])
              end

      render json: order.as_json(include: :order_items)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Order not found" }, status: :not_found
    end


    def cancel
      order = Order.find_by(id: params[:id])
      if current_user.admin? || current_user.manager?
        order.update(status: :canceled)
        render json: { message: "Order canceled successfully", order: order }
      else
        render json: { error: "You are not authorized to cancel this order" }, status: :forbidden
      end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Order not found"}, status: :not_found
    end

    def checkout
      order = if current_user.admin? || current_user.manager?
                Order.find(params[:id])  
              else
                current_user.orders.find(params[:id])  
              end

      if current_user.admin? || current_user.manager?
        order.update!(status: :paid)
        render json: { message: "Order paid successfully", order: order }
      else
        render json: { error: "You are not authorized to perform checkout" }, status: :forbidden
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Order not found" }, status: :not_found
    end




    private

    def order_params
      params.require(:order).permit(:restaurant_id,
        order_items_attributes: [:menu_item_id, :quantity, :subtotal])
    end
  end
end
