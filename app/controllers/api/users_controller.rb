class Api::UsersController < UsersController

  def index
    @users = @login_status ? User.all : nil
  end


  def create
    @user = User.new(user_params)

    log_in @user if @user.save
    render :show
  end

  def update
    @user = User.find_by({ username: user_params[:username] })
    require_ownership!(@user)
    if @owner_status
      if @user.update(user_params)
        render :show
      else
        render :show, status: 422
      end
    else
      render :show, status: 550
    end
  end

  def profile
    @user = User.find_by({ username: params[:username] })

    @follow = logged_in? && current_user != @user ?
      current_user.follows.find_by(user_id: @user.id) : nil

    render :show
  end

  def followers
    user = User.find_by({ username: params[:id] })
    if !!user
      @users = user.followers
      render :index
    else
      render json: {}, status: 422
    end
  end

  def following
    user = User.find_by({ username: params[:id] })
    if !!user
      @users = user.following
      render :index
    else
      render json: {}, status: 422
    end
  end

  def is_following
    unless logged_in?
      render json: nil, status: 422
      return
    end
    follow = current_user.follows.find_by(user_id: params[:id])
    if !!follow
      render json: follow
    else
      render json: nil, status: 404
    end
  end

  def feed
    @photos = current_user.feed_photos
    render 'api/photos/index'
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
