class User < ActiveRecord::Base
  validates :username, :password, :email, :full_name, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }, confirmation: true
  validates :email, format: {
    with: /\w+([.+-][_]*\w+)*@(\w+[.-][_]*)*\w+\.\w+/
  }
  validates :website_url, format: {
    with: /(\S+)/
  }, allow_blank: true

  has_one :user_session, dependent: :destroy

  after_create :ensure_session_token

  attr_reader :password

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end

  def ensure_session_token
    self.user_session || self.create_user_session
  end

  def self.find_by_username_password(username, password)
    user = find_by(username: username)
    user && user.is_password?(password) ? user : nil
  end
end
