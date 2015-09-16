class ChangeFollows < ActiveRecord::Migration
  def change
    change_table :follows, primary_key: :id do |t|
      t.remove :user_id
      t.references :user, null: false, index: true
      t.index [:user_id, :follower_id], unique: true
      t.index [:follower_id, :user_id], unique: true
    end
  end
end
