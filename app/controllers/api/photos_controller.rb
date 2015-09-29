class Api::PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :destroy, :like, :unlike]
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
  end

  def create
    @photo = current_user.photos.create(photo_params)
    @photo.caption.update(body: params[:photo][:caption][:body])

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

    def send_photos_errors
      @photos.to_a.each { |photo| pull_errors_from photo }
    end

    def send_photo_errors
      pull_errors_from @photo
    end

    def photo_params
      params.require(:photo).permit(:photo, :caption)
    end
end
