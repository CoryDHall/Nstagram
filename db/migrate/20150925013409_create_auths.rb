class CreateAuths < ActiveRecord::Migration
  def change
    create_table :auths do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.string :access_token
      t.string :provider, null: false

      t.timestamps null: false
    end
  end
end
