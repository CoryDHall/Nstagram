class Api::PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :destroy, :like, :unlike]
  before_action :require_log_in!, except: [:user_index, :show]
  before_action :require_ownership!, only: [:destroy]

  def index
    @style = !!params["style"] ? params["style"].intern : :thumb
  end

  def user_index
    @photos = User.find_by({ username: params[:username] }).photos.order(created_at: :desc)
    @style = !!params["style"] ? params["style"].intern : :thumb
    render :index
  end

  def show
  end

  def create
    current_user.photos.create(photo_params)
    render json: {}, status: 200
  end

  def destroy
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

  def require_ownership!(user)
    @owner_status = owner?(user.id)
  end

  private

    def set_photo
      @photo = Photo.find(params[:photo_id])
    end

    def photo_params
      params.require(:photo).permit(:photo)
    end
end
