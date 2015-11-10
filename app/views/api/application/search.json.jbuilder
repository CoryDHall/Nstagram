if @u_scope
  json.users do
    json.array! @user_results do |result|
      json.username result.content.scan(/\w+/)[0]
    end
  end
end
if @p_scope
  json.photos do
    json.array! @photo_results do |photo|
      json.extract! photo, :id
      json.url asset_path(photo.photo.url(:thumb))
      json.user do
        json.extract! photo.user, :id, :username
      end
      json.style :thumb
    end
  end
end
