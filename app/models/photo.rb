class Photo < ActiveRecord::Base
  include PgSearch
  pg_search_scope :_has_hashtags, lambda { |*args, query| {
    associated_against: {
      comments: :body
    },
    query: Comment.encode("##{query}")
    }
  }
  validates :user, :photo, presence: true
  before_save :ensure_caption
  after_save :commit_caption

  belongs_to :user

  has_attached_file :photo,
  preserve_files: "true",
    styles: {
      thumb: ['300x300#', :jpg],
      full: '1200'
    }

  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\Z/
  validates_attachment_file_name :photo, matches: [/png\Z/, /jpe?g\Z/, /gif\Z/]

  has_many :likes,
    dependent: :destroy

  has_many :likers,
    through: :likes,
    source: :user

  has_one :caption,
    class_name: "Comment"

  has_many :comments,
    dependent: :destroy

  def last_two_comments
    comments
      .includes(:user)
      .order("comments.created_at DESC")
      .where.not(id: caption_id)
      .first(3)

  end

  def caption
    @caption ||= comments
      .order("created_at ASC")
      .first
  end

  def caption_id
    cap = $redis.hget("photo_caption_ids", id)
    if cap.nil?
      cap = caption.id
      $redis.hset("photo_caption_ids", id, cap)
    end
    cap
  end

  def caption_body
    cap = $redis.hget("photo_captions", id)
    if cap.nil?
      cap = self.caption.body
      $redis.hset("photo_captions", id, cap)
    end
    cap
  end

  def num_likes
    num = $redis.hget("num_likes", id)
    if num.nil?
      num = self.likes.count
      $redis.hset("num_likes", id, num)
    end
    num.to_i
  end

  def like_list
    list = $redis.hget("photo_likers", id)
    if list.nil?
      list = self.likers.select(:username)
      $redis.hset("photo_likers", id, list.to_json)
    else
      list = JSON.parse(list)
    end
    list
  end

  def self.clear_likes_cache_for(id)
    $redis.hdel("num_likes", id)
    $redis.hdel("photo_likers", id)
  end

  def self.clear_comments_cache_for(id)
    $redis.hdel("photo_captions", id)
  end

  def save(*args)
    Photo.clear_likes_cache_for id
    Photo.clear_comments_cache_for id
    super(*args)
  end

  def hashtags
    @hashtags ||= self.comments.map(&:hashtags).flatten.compact
  end

  def self.has_hashtag(tag)
    order("created_at DESC")._has_hashtags(tag).page(1)
  end

  def self.order_by_popularity
    self
      .joins("LEFT OUTER JOIN comments ON comments.photo_id = photos.id")
      .group(:id)
      .joins("LEFT OUTER JOIN likes ON likes.photo_id = photos.id")
      .group(:id)
      .select("photos.*")
      .order("COUNT(photos.id) DESC")
  end

  paginates_per 6

  def ensure_caption
    self.caption ||= self.build_caption(body: "", user: self.user);
  end

  def commit_caption
    caption_body
    self.caption.save;
  end
end
