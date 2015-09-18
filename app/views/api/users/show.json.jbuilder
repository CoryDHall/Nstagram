json.errors @user.errors.full_messages
json.extract! @user,
  :id,
  :username,
  :full_name,
  :bio,
  :website_url,
  :profile_picture,
  :num_followers,
  :num_following

json.follow @follow
json.is_following !!@follow if logged_in? && current_user != @user
