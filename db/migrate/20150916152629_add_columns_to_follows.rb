class AddColumnsToFollows < ActiveRecord::Migration
  def change
    add_column :follows, :follower_id, :integer
    add_index :follows, :follower_id
  end
end
