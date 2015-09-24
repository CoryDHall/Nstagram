class UserSessionsController < ApplicationController
  before_action :prohibit_log_in!, only: [:new, :create]
  after_action :send_user_errors, only: [:get_current]

  def new
    @user_session = UserSession.new
    @user = User.new
  end

  def create
    user = User.find_by_username_password(
      session_params[:username],
      session_params[:password]
    );

    if !!user
      log_in user
      redirect_to root_url
    else
      redirect_to new_user_session_url
    end
  end

  def destroy
    log_out

    @user_session = UserSession.new
    redirect_to new_user_session_url
  end

  def create_session
    user = User.find_by_username_password(
      session_params[:username],
      session_params[:password]
    );
    log_in user if !!user
    get_current
  end

  def get_current
    @user = current_user
    if !!@user
      render 'api/users/show_current'
    else
      render json: current_user
    end
  end

  def destroy_current
    log_out
    render json: current_user
  end

  private

    def send_user_errors
      pull_errors_from @user
    end

    def session_params
      params.require(:session).permit(:username, :password)
    end
end
