class Like < ActiveRecord::Base
  validates :user, :photo, presence: true
  validates_uniqueness_of :user_id, scope: :photo_id
  belongs_to :user
  belongs_to :photo
  after_save :update_photo
  before_destroy :update_photo

  def update_photo
    Photo.clear_likes_cache_for photo_id
  end
end
