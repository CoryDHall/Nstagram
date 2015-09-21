class AddAttachmentProfilePictureToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.attachment :profile_picture
      t.remove :profile_photo_url
    end
  end

  def self.down
    remove_attachment :users, :profile_picture
  end
end