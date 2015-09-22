json.array!(@photos.includes(:user)) do |photo|
  json.extract! photo, :id, :created_at, :user
  json.url asset_path(photo.photo.url(@style || :thumb))
end
