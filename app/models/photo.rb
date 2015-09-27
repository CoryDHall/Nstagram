class Photo < ActiveRecord::Base
  validates :user, :photo, presence: true
  before_save :ensure_caption
  after_save :commit_caption

  belongs_to :user

  has_attached_file :photo,
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

  paginates_per 6

  def ensure_caption
    self.caption ||= self.build_caption(body: "", user: self.user);
  end

  def commit_caption
    self.caption.save;
  end
end
