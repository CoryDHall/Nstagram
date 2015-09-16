class AddForeignKeyToFollows < ActiveRecord::Migration
  def change
    change_column :follows, :follower_id, :integer, null: false
    add_foreign_key :follows, :users, column: :follower_id
  end
end
