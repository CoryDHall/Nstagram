class AddColumnUidToAuth < ActiveRecord::Migration
  def change
    add_column :auths, :uid, :string, null: false
  end
end
