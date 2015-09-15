class UserSessionsController < ApplicationController
  before_action :set_session, only: [:show, :edit, :update, :destroy]
  before_action :prohibit_log_in!, only: [:new, :create]
  # GET /sessions
  def index
    @user_sessions = UserSession.all
  end

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
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_session
      @user_session = UserSession.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def session_params
      params.require(:session).permit(:username, :password)
    end
end
