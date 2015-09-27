class AddUserNameIndexToAuths < ActiveRecord::Migration
  def change
    add_index :auths, [:provider, :uid], unique: true
  end
end
