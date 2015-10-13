class Api::ApplicationController < ApplicationController
  def search
    @user_results = PgSearch.multisearch(params[:query]).page(1)
    @photo_results = Photo.has_hashtag(params[:query])
    render :search, format: :json
  end
end
