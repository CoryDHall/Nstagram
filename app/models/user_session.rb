class UserSession < ActiveRecord::Base
  validates :user, presence: true

  belongs_to :user

  def reset
    self.session_token = SecureRandom::urlsafe_base64
    self.save
    self.session_token
  end

  def clear
    self.session_token = nil
    self.save
  end
end
