class Photo < ActiveRecord::Base
  validates :user, :photo, presence: true

  belongs_to :user

  has_attached_file :photo,
    styles: {
      thumb: ['300x300#', :jpg],
      full: '900'
    }

  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\Z/
  validates_attachment_file_name :photo, matches: [/png\Z/, /jpe?g\Z/, /gif\Z/]
end