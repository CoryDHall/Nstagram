Rails.application.routes.draw do

  root to: 'static_page#root'

  namespace :api, as: '' do
    resource :feed,
      only: [:index],
      defaults: { format: :json } do

      root to: 'users#feed'
    end

    resources :users,
      except: [:destroy, :new, :edit],
      defaults: { format: :json } do

      collection do
        get '::username', to: 'users#profile'

        get '::username/photos', to: 'photos#user_index'
        post '::username/photos', to: 'photos#create'
        get '::username/photo/:photo_id', to: 'photos#show'
        delete '::username/photo/:photo_id', to: 'photos#destroy'
      end

      member do
        get 'followers', to: 'users#followers'

        get 'following', to: 'users#following'

        get 'follow', to: 'users#is_following'
        post 'follow', to: 'users#follow'
        put 'follow', to: 'users#follow'
        delete 'follow', to: 'users#unfollow'
      end
    end
  end

  resources :users, controller: 'users' do
    member do
      post 'follow', to: 'users#follow'
      delete 'follow', to: 'users#unfollow'
    end
  end

  resource :user_session,
    only: [:new, :destroy, :create] do
      get 'current', to: 'user_sessions#get_current'
      post 'current', to: 'user_sessions#create_session'
      delete 'current', to: 'user_sessions#destroy_current'
    end
end
