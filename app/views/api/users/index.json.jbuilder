follows = current_user.follows.to_a
# byebug
@users << User.new
last_page = @users.length <= @users.limit_value

json.array!(@users) do |user|
  next if user.id.nil?
  json.extract! user, :id, :username, :profile_picture
  json.profile_picture_url asset_path(user.profile_picture.url(:square))
  if logged_in? && current_user != user
    follow = follows.select { |f| f.user_id == user.id }.first
    json.is_following  !!follow
    json.follow follow
  end
  json.is_on_last_page last_page

end
