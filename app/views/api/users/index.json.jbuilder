json.array!(@users) do |user|
  json.extract! user, :id, :username, :profile_photo_url
end
