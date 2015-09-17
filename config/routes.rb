Rails.application.routes.draw do

  root to: 'static_page#root'

  namespace :api, as: '' do
    resources :users,
      except: [:destroy, :new, :edit],
      defaults: { format: :json } do

      member do
        post 'follow', to: 'users#follow'
        post 'unfollow', to: 'users#unfollow'
      end
    end
  end


  resources :users, controller: 'users' do
    member do
      post 'follow', to: 'users#follow'
      post 'unfollow', to: 'users#unfollow'
    end
  end
  resource :user_session, only: [:new, :destroy, :create]
end
