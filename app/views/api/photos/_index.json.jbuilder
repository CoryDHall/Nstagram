json.array!(@photos.includes(:user)) do |photo|
  @photo = photo
  json.partial! 'api/photos/show'
end
