class Api::UsersController < UsersController

  def index
    @users = @login_status ? User.all : nil
  end


  def create
    @user = User.new(user_params)

    log_in @user if @user.save
    render json: current_user
  end

  def profile
    @user = User.find_by({ username: params[:username] })

    render :show
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
