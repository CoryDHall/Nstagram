class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :password_digest, null: false
      t.string :full_name, null: false
      t.string :bio
      t.string :website_url
      t.string :profile_photo_url

      t.timestamps null: false
    end
    add_index :users, :username, unique: true
    add_index :users, :full_name
  end
end
