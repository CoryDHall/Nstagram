Rails.application.routes.draw do
  root 'users#index'

  resources :users
  resource :user_session, only: [:new, :create, :destroy]
end
