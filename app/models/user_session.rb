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

  def online_status
    !self.session_token.empty?
  end

  # def save
  #   $redis.set(self.token, { id: self.id, online: online_status }.to_json);
  #   super
  # end
  #
  # def self.find_by(attribute)
  #   cache = JSON.parse $redis.get(attribute[:session_token])
  #   return super(attribute) unless cache[:online]
  #   UserSession.find(cache[:id])
  # end
end
