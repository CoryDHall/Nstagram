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
    redirect_to new_user_session_url unless current_user
  end

  def prohibit_log_in!
    redirect_to root_url if current_user
  end

  def owner?(id)
    current_user.id == id
  end

  def require_ownership!(user)
    redirect_to root_url unless owner?(user.id)
  end

end
