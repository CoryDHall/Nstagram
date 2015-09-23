json.cache! ['v1', @photo], expires_in: 24.hours do
  json.extract! @photo, :id, :created_at
end
json.user do
  json.cache! ['v1', @photo.user], expires_in: 10.minutes do
    json.extract! @photo.user, :id, :username
    json.profile_picture_url asset_path(@photo.user.profile_picture.url(:square))
  end
end
json.posted distance_of_time_in_words_to_now @photo.created_at
json.url asset_path(@photo.photo.url(@style || :thumb))
