class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :require_log_in!, except: [:new, :show]
  before_action :prohibit_log_in!, only: [:new]


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

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  def update
    require_ownership!(@user)
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  def destroy
    require_ownership!(@user) unless current_user.username == "admin"
    @user.destroy
    redirect_to users_url
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :full_name, :bio, :website_url, :profile_photo_url)
    end
end
