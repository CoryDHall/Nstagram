class Api::PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :destroy, :like, :unlike, :comments, :new_comment, :delete_comment]
  before_action :require_log_in!, except: [:user_index, :show]
  before_action :require_ownership!, only: [:destroy]
  after_action :send_photos_errors, only: [:index, :user_index]
  after_action :send_photo_errors, only: [:show, :create, :destroy, :like, :unlike]

  def index
    @style = !!params["style"] ? params["style"].intern : :thumb
  end

  def user_index
    @style = !!params["style"] ? params["style"].intern : :thumb
    @photos = User.find_by({ username: params[:username] })
      .photos.order(created_at: :desc)
      .page(params["page"] || 1)
      .per(@style == :thumb ? 12 : 6);
    render :index
  end

  def show
    @style = :full
  end

  def create
    @photo = current_user.photos.create(photo_params)
    @photo.caption.update(body: params[:photo][:caption][:body])
    current_user.update_redis

    render json: {}, status: 200
  end

  def destroy
    if @owner_status
      @photo.likes.destroy
      @photo.comments.destroy
      @photo.caption.destroy
      @photo.destroy
      render json: {}, status: 200
    else
      render json: {}, status: 400
    end
  end

  def like
    @like = current_user.like @photo
    render json: @like, status: 200
  end

  def unlike
    @like = current_user.unlike @photo
    render json: @like, status: 200
  end

  def require_log_in!
    @login_status = logged_in?
  end

  def require_ownership!()
    user = User.find_by(username: params[:username])
    @owner_status = owner?(user.id)
  end

  def comments
    @comments = @photo.comments
    render :comments
  end

  def new_comment
    comment = @photo.comments.new(user: current_user, body: comment_params[:body])
    if comment.save
      status = 200
    else
      status = 402
    end
    Photo.clear_comments_cache_for @photo.id
    render json: comment, status: status
  end

  def delete_comment
    comment = Comment.find(params[:comment_id])
    valid = comment &&
      (comment.user == current_user || comment.super_user == current_user)
    if valid
      @photo.comments.delete(comment)
      status = 200
    else
      status = 402
    end
    Photo.clear_comments_cache_for @photo.id
    render json: {}, status: status
  end

  private

    def set_photo
      @photo = Photo.find(params[:photo_id])
    end

    def send_photos_errors
      @photos.to_a.each { |photo| pull_errors_from photo }
    end

    def send_photo_errors
      pull_errors_from @photo
    end

    def photo_params
      params.require(:photo).permit(:photo, :caption)
    end

    def comment_params
      params.require(:comment).permit(:body)
    end
end
