
json.errors @user.errors.full_messages
json.extract! @user,
  :id,
  :username,
  :num_following,
  :num_posts

json.profile_picture_url asset_path(@user.profile_picture.url(:square))
