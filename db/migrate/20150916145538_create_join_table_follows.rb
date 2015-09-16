class CreateJoinTableFollows < ActiveRecord::Migration
  def change
    create_table :follows, id: false do |t|
      t.references :user, primary_key: true
      t.timestamps null: false
    end
  end
end
