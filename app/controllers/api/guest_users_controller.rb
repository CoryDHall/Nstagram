class Api::GuestUsersController < Api::UsersController
  def create
    @user = UserFactory.create_user "guest_#{Time.now.to_i - 1443735989}" #2015-10-01 ~17:46
    UserFactory.get_profile_picture_from_tumblr @user

    @user.guest_user_data.create ip_address: request.remote_ip

    log_in @user if @user.save
    @user.errors["welcome"] = "#{@user.username}, try following some users! -$Ssuccess"
    render :show
  end
end
