last_page = @photos.last_page?

json.array!(@photos.includes(:user, :likes, :caption, :comments)) do |photo|
  @photo = photo
  json.partial! 'api/photos/show'
  json.is_on_last_page last_page
end
