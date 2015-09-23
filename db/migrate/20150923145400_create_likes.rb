class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.references :photo, index: true, foreign_key: true, null: false

      t.timestamps null: false
    end

    add_index :likes, [:user_id, :photo_id], unique: true
  end
end
