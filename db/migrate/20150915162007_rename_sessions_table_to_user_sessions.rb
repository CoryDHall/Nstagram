class RenameSessionsTableToUserSessions < ActiveRecord::Migration
  def change
    rename_table :sessions, :user_sessions
  end
end
