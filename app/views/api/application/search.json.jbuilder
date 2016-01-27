if @u_scope
  json.users do
    json.array! @user_results do |result|
      json.username result.content.scan(/\w+/)[0]
    end
  end
end
if @p_scope
  json.photos do
    last_page = @photo_results.last_page?
    json.array!(@photo_results.includes(:user, :likes)) do |photo|
      @photo = photo
      json.partial! 'api/photos/show'
      json.is_on_last_page last_page
    end
    # json.array! @photo_results do |photo|
    #   json.extract! photo, :id
    #   json.url asset_path(photo.photo.url(:thumb))
    #   json.user do
    #     json.extract! photo.user, :id, :username
    #   end
    #   json.style :thumb
    # end
  end
end
