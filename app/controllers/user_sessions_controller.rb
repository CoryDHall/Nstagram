class UserSessionsController < ApplicationController
  before_action :prohibit_log_in!, only: [:new, :create, :twitter]
  after_action :send_user_errors, only: [:get_current, :create_session, :destroy_current, :twitter]

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
    @user = User.find_by_username_password(
      session_params[:username],
      session_params[:password]
    ) || User.new(username: session_params[:username]);
    if @user.persisted?
      log_in @user
    else
      @user.errors.add :login, "Unable to log in -$Sfailure"
    end
    get_current
  end

  def get_current
    @user ||= current_user
    @user ||= User.new()
    render 'api/users/show_current'
  end

  def destroy_current
    log_out
    @user = User.new
    if !!session[:token]
      @user.errors.add :logout, "Log out unsuccessful! -$Sfailure"
    else
      @user.errors.add :logout, "Log out successful! -$Ssuccess"
    end
    render 'api/users/show_current'
  end

  def twitter

    l = Logger.new "./log/twitter.auth.log"
    l << "*" * 80
    l << "*" * 80
    l << "\n\n"
    l << auth_hash.inspect.gsub(ENV["twitter_key"], "x"*5).gsub(ENV["twitter_secret"], "x"*5)
    l << "\n\n"
    l << "=" * 80
    l << "=" * 80

    @user = User.find_or_create_from_auth_hash(auth_hash)
    if @user.persisted?
      log_in @user
    else
      @user.errors['log in/sign up'] = "Unable to authenticate your credentials -$Sfailure"
    end
    redirect_to :root
  end

  def auth_hash
    request.env['omniauth.auth']
  end

  private

    def send_user_errors
      pull_errors_from @user
    end

    def session_params
      params.require(:session).permit(:username, :password)
    end
end
