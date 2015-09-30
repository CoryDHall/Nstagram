json.array! @comments.includes(:user, :super_user) do |comment|
  json.extract! comment, :id, :body
  json.user comment.user.username
  json.photo_id comment.photo.id
  json.super_user comment.super_user.username
end
