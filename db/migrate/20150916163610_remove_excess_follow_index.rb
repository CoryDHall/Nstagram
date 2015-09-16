class RemoveExcessFollowIndex < ActiveRecord::Migration
  def change
    remove_index "follows", name: "index_follows_on_user_id_and_follower_id"
  end
end
