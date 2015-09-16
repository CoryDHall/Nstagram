Rails.application.routes.draw do
  root 'users#index'

  resources :users do
    member do
      post 'follow', to: 'users#follow'
      post 'unfollow', to: 'users#unfollow' 
    end
  end
  resource :user_session, only: [:new, :create, :destroy]
end
