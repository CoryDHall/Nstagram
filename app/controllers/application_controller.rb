class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?, :owner?

  def errors
    _errors = []

    flash.each do |reference, message|
      this_error = {}
      this_error[:reference] = reference
      this_error[:message], this_error[:status] = message.split("-$STATUS: ")
      this_error[:status], this_error[:time] = this_error[:status].split("-$TIME: ")
      this_error[:length] = 2

      _errors << this_error
    end

    flash.clear
    render json: _errors
  end

  def pull_errors_from (model)
    return unless model && !!model.errors
    model.errors.keys.each do |attribute|
      composite_message = model.errors.full_messages_for(attribute)
        .map { |message| message.split(" ")[1..-1].join(" ") }
        .join(" | ")

      status_code = composite_message[/(failure|notice|success)(?<!-\$S)/]
      status_code ||= "failure"

      composite_message.gsub!(/-\$S(failure|notice|success)/, "");

      flash["#{model.class.name}: #{attribute}"] = composite_message + "-$STATUS: #{status_code}" + "-$TIME: #{Time.now}"
    end
  end

  def failure
    flash[:status] = "Resource not found -$STATUS: failure -$TIME: #{Time.now}"
    render json: {}, status: 404
  end

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

    user_session = UserSession.find_by(session_token: session[:token]);
    @current_user = user_session.user if user_session
  end

  def logged_in?
    !current_user.nil?
  end

  def require_log_in!
    unless current_user
      flash['log_in restricted'] = "unable to perform this action while currently logged out -$STATUS: failure -$TIME: #{Time.now}"
      redirect_to new_user_session_url
    end
  end

  def prohibit_log_in!
    if current_user
      flash['log_in prohibited'] = "unable to perform this action while currently logged in -$STATUS: failure -$TIME: #{Time.now}"
      redirect_to root_url
    end
  end

  def owner?(id)
    current_user.id == id
  end

  def require_ownership!(user)
    redirect_to root_url unless owner?(user.id)
  end

end
