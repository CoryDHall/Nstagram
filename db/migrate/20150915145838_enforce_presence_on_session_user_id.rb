class EnforcePresenceOnSessionUserId < ActiveRecord::Migration
  def change
    change_column :sessions, :user_id, :integer, null: false
  end
end
