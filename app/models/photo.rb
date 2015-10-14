class Photo < ActiveRecord::Base
  include PgSearch
  pg_search_scope :_has_hashtags, lambda { |query| {
    associated_against: {
      comments: :body
    },
    query: "#" + query
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
      .includes(:user, :super_user)
      .order("comments.created_at DESC")
      .where.not(id: caption.id)
      .first(3)
      .reverse
  end

  def hashtags
    self.comments.map(&:hashtags).flatten.compact
  end

  def self.has_hashtag(tag)
    _has_hashtags(tag).page(1).select do |photo|
      photo.hashtags.flatten.include? ("##{tag}")
    end
  end

  paginates_per 6

  def ensure_caption
    self.caption ||= self.build_caption(body: "", user: self.user);
  end

  def commit_caption
    self.caption.save;
  end
end
