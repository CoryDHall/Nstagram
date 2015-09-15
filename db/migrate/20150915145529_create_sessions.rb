class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.references :user, index: true, foreign_key: true
      t.string :session_token

      t.timestamps null: false
    end
    add_index :sessions, :session_token
  end
end
