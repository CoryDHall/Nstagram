class Api::ApplicationController < ApplicationController
  def search
    @u_scope = %w(all users).include? params[:scope]
    @p_scope = %w(all photos).include? params[:scope]
    @user_results = PgSearch.multisearch(params[:query]).page(1) if @u_scope
    @photo_results = Photo.has_hashtag(params[:query]).order_by_popularity_score.includes(:user) if @p_scope
    render :search, format: :json
  end
end
