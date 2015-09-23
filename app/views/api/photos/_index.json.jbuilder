json.array!(@photos.includes(:user, :likes).limit(6)) do |photo|
  @photo = photo
  json.partial! 'api/photos/show'
end
