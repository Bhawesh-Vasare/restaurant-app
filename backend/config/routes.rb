Rails.application.routes.draw do
  devise_for :users

  namespace :api do
    post 'sessions', to: 'sessions#create'       
    delete 'sessions', to: 'sessions#destroy'    
    post 'users', to: 'users#create'             

    resources :restaurants, only: [:index, :show]
    resources :menu_items
    resources :orders, only: [:create, :index, :show] do
      member do
        post :cancel
        post :checkout
      end                    
    end

    resources :payment_methods, only: [:index, :create, :destroy]
  end
end
