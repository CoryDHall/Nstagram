class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy, :follow, :unfollow]
  before_action :require_log_in!, except: [:new, :show, :create]
  before_action :prohibit_log_in!, only: [:new, :create]


  def index
    puts current_user
    @users = User.all
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
    require_ownership!(@user)
  end

  def create
    @user = User.new(user_params)

    if @user.save
      log_in @user
      redirect_to root_url
    else
      render :new
    end
  end

  def update
    require_ownership!(@user)

    if @user.update(user_params)
      redirect_to users_url(@user)
    else
      render :edit
    end
  end

  def destroy
    require_ownership!(@user) unless current_user.username == "admin"
    @user.destroy
    redirect_to users_url
  end

  def follow
    current_user.follow(@user)
    redirect_to user_url(@user)
  end

  def unfollow
    current_user.unfollow(@user)
    redirect_to user_url(@user)
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :full_name, :bio, :website_url, :profile_photo_url)
    end
end
