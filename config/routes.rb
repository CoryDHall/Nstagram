Rails.application.routes.draw do

  root to: 'static_page#root'

  namespace :api, as: '' do
    get 'errors', to: '/application#errors'


    resource :feed,
      only: [:index],
      defaults: { format: :json } do

      root to: 'users#feed'
    end

    resources :users,
      except: [:destroy, :new, :edit],
      defaults: { format: :json } do


      collection do
        post 'guest/new', to: 'guest_users#create'
        get '::username', to: 'users#profile', username: /[\w-]+/

        get '::username/photos', to: 'photos#user_index'
        post '::username/photos', to: 'photos#create'
        get '::username/photos/:photo_id', to: 'photos#show'
        delete '::username/photos/:photo_id', to: 'photos#destroy'
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

    post 'like/:photo_id', to: 'photos#like'
    put 'like/:photo_id', to: 'photos#like'
    delete 'like/:photo_id', to: 'photos#unlike'

    get 'comments/:photo_id', to: 'photos#comments'
    post 'comments/:photo_id', to: 'photos#new_comment'
    put 'comments/:photo_id/:comment_id', to: 'photos#new_comment'
    delete 'comments/:photo_id/:comment_id', to: 'photos#delete_comment'

    get '*redirect', to: '/application#failure'
  end

  get 'auth/twitter/callback', to: 'user_sessions#twitter'

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

  get '*redirect', to: redirect('/')
end
