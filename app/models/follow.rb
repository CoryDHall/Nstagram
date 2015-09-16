class Follow < ActiveRecord::Base
  validates :follower, :user, presence: true
  validates_uniqueness_of :user_id, scope: :follower_id
  validate :user_cannot_follow_self

  has_one :follower,
    class_name: "User",
    foreign_key: :id,
    primary_key: :follower_id

  belongs_to :user

  def follower=(follower)
    self.follower_id = follower.id
  end

  private

    def user_cannot_follow_self
      if self.user_id == self.follower_id
        errors.add(:follow, "User cannot follow itself")
      end
    end
end
