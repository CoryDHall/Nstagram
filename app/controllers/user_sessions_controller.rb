class UserSessionsController < ApplicationController
  before_action :prohibit_log_in!, only: [:new, :create]

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

  private

    def session_params
      params.require(:session).permit(:username, :password)
    end
end
