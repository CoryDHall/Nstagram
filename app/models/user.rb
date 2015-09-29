class User < ActiveRecord::Base
  validates :username, :password, :email, :full_name, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }, confirmation: true
  validates :email, format: {
    with: /\w+([.+-][_]*\w+)*@(\w+[.-][_]*)*\w+\.\w+/
  }
  validates :website_url, format: {
    with: /(\S+)/
  }, allow_blank: true

  validates :username, format: {
    with: /[\w_-]+/
  }

  validate :username_is_case_insensitive_unique

  has_attached_file :profile_picture,
    styles: {
      square: ['200x200#', :jpeg]
    },
    default_url: "missing.png"

  validates_attachment_content_type :profile_picture, content_type: /\Aimage\/.*\Z/
  validates_attachment_file_name :profile_picture, matches: [/png\Z/, /jpe?g\Z/, /gif\Z/]

  has_one :user_session, dependent: :destroy

  has_many :follows,
    foreign_key: :follower_id,
    dependent: :destroy

  has_and_belongs_to_many :followers,
    class_name: "User",
    join_table: :follows,
    association_foreign_key: :follower_id

  has_and_belongs_to_many :following,
    class_name: "User",
    join_table: :follows,
    foreign_key: :follower_id

  has_many :photos,
    dependent: :destroy

  has_many :feed_photos,
    through: :following,
    source: :photos

  has_many :likes,
    dependent: :destroy

  has_many :liked_photos,
    through: :likes,
    source: :photo

  has_many :auths,
    dependent: :destroy

  paginates_per 24

  after_create :ensure_session_token

  attr_reader :password

  def follow (user)
    self.follows.create(user: user)
  end

  def unfollow (user)
    following?(user) && self.following.delete(user)
  end

  def like (photo)
    self.likes.create(photo: photo)
  end

  def unlike (photo)
    _like = self.likes.where(photo: photo)
    self.likes.delete(_like)
    _like
  end

  def likes? (photo)
    self.liked_photos.exists?(id: photo.id)
  end

  def following? (user)
    self.following.exists?(id: user.id)
  end

  def num_followers
    self.followers.count
  end

  def num_following
    self.following.count
  end

  def num_posts
    self.photos.count
  end

  def full_feed
    Photo.where(user: [self] | self.following)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def password
    @password = "********" if self.persisted?
    @password
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

  def self.find_or_create_from_auth_hash (auth_hash)
    auth = Auth.find_by(uid: auth_hash[:uid])
    if auth.nil?
      auth = Auth.new(uid: auth_hash[:uid], provider: auth_hash[:provider])
      user = UserFactory.make_from_auth(auth, auth_hash[:info][:name].gsub(/\s/, "_"))
      auth.save
    else
      user = find(auth.user_id)
    end
    user
  end

  def self.order_by_num_photos
    self
    .joins("LEFT OUTER JOIN photos ON photos.user_id = users.id")
    .group(:id)
    .joins("LEFT OUTER JOIN photos AS photos_0 ON photos_0.user_id = users.id")
    .select("users.* ")
    .order("COUNT(photos_0.user_id) DESC")
  end

  def username_is_case_insensitive_unique
    if User.all.any? do |user|
      user.username.downcase == self.username.downcase &&
        user != self
      end
      errors.add(:username, "'@#{self.username}' is already taken!")
    end
  end
end
