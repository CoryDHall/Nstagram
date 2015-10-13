class Comment < ActiveRecord::Base
  validates :user_id, :photo_id, presence: true
  validates :body, length: { minimum: 1, allow_blank: true }

  belongs_to :user
  belongs_to :photo

  has_one :super_user,
    through: :photo,
    source: :user

  def hashtags
    self.body.scan(/#\w+/)
  end
end
