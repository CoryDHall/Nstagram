class UserSession < ActiveRecord::Base
  validates :user, presence: true

  belongs_to :user

  after_create :reset_token

  def reset_token
    token.replace SecureRandom::urlsafe_base64
    self.save
    token
  end

  def clear_token
    token.clear
    self.save
  end

  def token
    self.session_token ||= ""
  end
end
