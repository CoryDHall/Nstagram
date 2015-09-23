json.array!(@photos.includes(:user)) do |photo|
  json.extract! photo, :id, :created_at
  json.user do
    json.extract! photo.user, :id, :username
    json.profile_picture_url asset_path(photo.user.profile_picture.url(:square))
  end
  json.posted distance_of_time_in_words_to_now photo.created_at
  json.url asset_path(photo.photo.url(@style || :thumb))
end
