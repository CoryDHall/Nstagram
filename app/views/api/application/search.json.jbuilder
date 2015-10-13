json.users do
  json.array! @user_results do |result|
    json.username result.content.scan(/\w+/)[0]
  end
end
json.photos do
  json.array! @photo_results, :id
end
