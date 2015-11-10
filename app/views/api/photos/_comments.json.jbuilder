json.array! @comments do |comment|
  json.extract! comment, :id, :body
  json.user comment.user.username
  json.photo_id comment.photo_id
end
