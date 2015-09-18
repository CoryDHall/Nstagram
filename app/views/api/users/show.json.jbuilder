json.extract! @user,
  :id,
  :username,
  :full_name,
  :bio,
  :website_url,
  :profile_photo_url,
  :num_followers,
  :num_following

json.follow @follow
json.is_following !!@follow if logged_in? && current_user != @user
