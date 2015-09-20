json.array!(@users) do |user|
  json.extract! user, :id, :username, :profile_picture
  json.profile_picture_url asset_path(user.profile_picture.url(:square))
end
