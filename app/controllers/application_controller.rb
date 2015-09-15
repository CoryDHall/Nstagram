class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :require_log_in!, :logged_in?


  def log_in(user)
    session[:token] = user.user_session.reset_token
    @current_user = user
  end

  def log_out
    current_user.user_session.reset_token
    session[:token] = nil
  end

  def current_user
    return @current_user if @current_user
    # byebug
    user_session = UserSession.find_by(session_token: session[:token]);
    @current_user = user_session.user if user_session
  end

  def logged_in?
    !current_user.nil?
  end

  def require_log_in!
    redirect_to new_user_session_url unless current_user
  end

  def prohibit_log_in!

  end

end
