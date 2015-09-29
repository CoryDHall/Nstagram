json.errors @user.errors.full_messages
json.extract! @user,
  :id,
  :username,
  :full_name,
  :bio,
  :website_url,
  :profile_picture,
  :num_followers,
  :num_following,
  :num_posts

json.follow @follow
json.is_following !!@follow if logged_in? && current_user != @user

json.profile_picture_url asset_path(@user.profile_picture.url(:square))

json.photos do
  @photos = @user.photos.order(created_at: :desc).page(1).per(12)
  json.partial! 'api/photos/index'
end
