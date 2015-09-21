json.array!(@photos) do |photo|
  json.extract! photo, :id, :created_at
  json.url asset_path(@photo.photo_url(:thumb))
end
