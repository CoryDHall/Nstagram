
json.cache! ['v1', @photo], expires_in: 24.hours do
  json.extract! @photo, :id, :created_at
end
json.user do
  json.cache! ['v1', @photo.user], expires_in: 10.minutes do
    json.extract! @photo.user, :id, :username
    json.profile_picture_url asset_path(@photo.user.profile_picture.url(:square))
  end
end
json.posted distance_of_time_in_words_to_now @photo.created_at
json.url asset_path(@photo.photo.url(@style || :thumb))

if logged_in?
  @current_user ||= current_user
  @likes ||= @current_user.likes.load
  @liked_photo_ids ||= @likes.map(&:photo_id)

  json.is_current_user_liking @liked_photo_ids.include? @photo.id
  json.current_like @likes.find_or_initialize_by photo: @photo
  json.current_like_username @current_user.username
end
json.style (@style || :thumb)
if @style == :full
  json.likes do
    like_count = @photo.num_likes
    json.count like_count
    if like_count.between?(1,11)
      json.users do
        json.array! @photo.like_list
      end
    end
  end
  json.caption @photo.caption_body

  @comments = @photo.last_two_comments

  json.comments do
    json.partial! 'api/photos/comments'
  end
end
