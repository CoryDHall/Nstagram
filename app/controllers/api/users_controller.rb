class Api::UsersController < UsersController

  def index
    @users = @login_status ? User.all : nil
  end

  def require_log_in!
    @login_status = logged_in?
  end

  def prohibit_log_in!
    @login_status = logged_in?
  end

  def require_ownership!(user)
    @owner_status = owner?(user.id)
  end
end
