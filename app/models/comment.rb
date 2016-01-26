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

  def self.encode(message)
    letters = message.each_byte
    res = letters.map do |code|
      code == 32 ? ' ' : "%04d" % code
    end.to_a
    res.join('')
  end

  def self.decode(message)
    message.split(' ').map do |word|
      word.scan(/\d{4}/).map(&:to_i).map(&:chr).join('')
    end.join(' ')
  end

  def body
    Comment.decode(super)
  end

  def body=(value)
    super(Comment.encode(value))
  end

  def authorname
    user.username
  end
end
