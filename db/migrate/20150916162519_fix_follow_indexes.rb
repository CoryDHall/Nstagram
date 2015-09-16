class FixFollowIndexes < ActiveRecord::Migration
  def change
    remove_index :follows, name: :index_follows_on_user_id
    remove_index :follows, name: :index_follows_on_follower_id
    remove_index :follows, name: :index_follows_on_follower_id_and_user_id
    remove_index :follows, name: :index_follows_on_user_id_and_follower_id

    add_foreign_key :follows, :users
    add_index :follows, [:user_id, :follower_id], unique: true
    add_index :follows, [:follower_id, :user_id], unique: true

  end
end
