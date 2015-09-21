json.extract! @photo, :id, :created_at
json.url asset_path(@photo.photo.url(:full))
