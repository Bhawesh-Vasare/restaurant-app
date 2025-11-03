class ApplicationController < ActionController::API
  include ActionController::Helpers

  before_action :authenticate_user_from_token!

  private

  def authenticate_user_from_token!
    auth_header = request.headers['token']
    return render json: { error: "Missing Authorization header" }, status: :unauthorized unless auth_header.present?

    token = auth_header.split(' ').last
    user = User.find_by(authentication_token: token)

    if user
      @current_user = user
    else
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
