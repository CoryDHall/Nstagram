class Api::UsersController < UsersController
  after_action :send_users_errors, only: [:index, :followers, :following]
  after_action :send_user_errors, only: [:create, :update, :profile, :follow, :unfollow]
  after_action :send_follow_errors, only: [:profile, :is_following, :follow, :unfollow]

  def index
    @users = !@login_status ? nil : User
      .joins("LEFT OUTER JOIN photos ON photos.user_id = users.id")
      .group(:id)
      .joins("LEFT OUTER JOIN photos AS photos_0 ON photos_0.user_id = users.id")
      .select("users.* ")
      .order("COUNT(photos_0.user_id) DESC")
      .includes(:photos)
      .page(params["page"] || 1)
  end


  def create
    @user = User.new(user_params)

    log_in @user if @user.save
    render :show
  end

  def update
    @user = current_user
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
      @users = user.followers.order(:username).page(params["page"] || 1)
      render :index
    else
      render json: {}, status: 422
    end
  end

  def following
    user = User.find_by({ username: params[:id] })
    if !!user
      @users = user.following.order(:username).page(params["page"] || 1)
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
    @follow = current_user.follows.find_by(user_id: params[:id])
    if !!follow
      render json: @follow
    else
      render json: nil, status: 404
    end
  end

  def follow
    @follow = current_user.follow(@user)
    @user.errors.add :follow, "you followed #{@user.username} -$S#{current_user.following?(@user) ? "success" : "failure"}"
    render :show
  end

  def unfollow
    current_user.unfollow(@user)
    @follow = nil
    @user.errors[:follow] = "you unfollowed #{@user.username} -$S#{current_user.following?(@user) ? "failure" : "notice"}"
    render :show
  end


  def feed
    require_log_in!
    if @login_status
      @photos = current_user.full_feed.order(created_at: :desc).page(params["page"] || 1)
      @style = params["style"].intern
    else
      @photos = Photo.none
    end
    render 'api/photos/index'
  end

  def send_photos_errors
    @photos.to_a.each { |photo| pull_errors_from photo }
  end

  def send_users_errors
    @users.to_a.each { |user| pull_errors_from user }
  end

  def send_user_errors
    pull_errors_from @user
  end

  def send_follow_errors
    pull_errors_from @follow
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
