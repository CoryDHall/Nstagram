class CreateGuestUserData < ActiveRecord::Migration
  def change
    create_table :guest_user_data do |t|
      t.references :user, index: true, foreign_key: true
      t.string :ip_address, null: false

      t.timestamps null: false
    end
    add_index :guest_user_data, :ip_address
  end
end
