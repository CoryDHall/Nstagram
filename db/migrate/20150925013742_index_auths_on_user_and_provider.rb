class IndexAuthsOnUserAndProvider < ActiveRecord::Migration
  def change
    add_index :auths, [:user_id, :provider], unique: true
  end
end
