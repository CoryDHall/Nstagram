json.errors @user.errors.full_messages
json.extract! @user,
  :id,
  :username

json.profile_picture_url asset_path(@user.profile_picture.url(:square))
