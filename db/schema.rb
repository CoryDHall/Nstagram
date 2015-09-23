# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150923145724) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "photo_id",   null: false
    t.text     "body",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "comments", ["photo_id"], name: "index_comments_on_photo_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "follows", id: false, force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "follower_id", null: false
    t.integer  "user_id",     null: false
  end

  add_index "follows", ["follower_id", "user_id"], name: "index_follows_on_follower_id_and_user_id", unique: true, using: :btree

  create_table "likes", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "photo_id",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "likes", ["photo_id"], name: "index_likes_on_photo_id", using: :btree
  add_index "likes", ["user_id", "photo_id"], name: "index_likes_on_user_id_and_photo_id", unique: true, using: :btree
  add_index "likes", ["user_id"], name: "index_likes_on_user_id", using: :btree

  create_table "photos", force: :cascade do |t|
    t.integer  "user_id",            null: false
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
  end

  add_index "photos", ["user_id"], name: "index_photos_on_user_id", using: :btree

  create_table "user_sessions", force: :cascade do |t|
    t.integer  "user_id",       null: false
    t.string   "session_token"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "user_sessions", ["session_token"], name: "index_user_sessions_on_session_token", using: :btree
  add_index "user_sessions", ["user_id"], name: "index_user_sessions_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "username",                     null: false
    t.string   "password_digest",              null: false
    t.string   "full_name",                    null: false
    t.string   "bio"
    t.string   "website_url"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "email",                        null: false
    t.string   "profile_picture_file_name"
    t.string   "profile_picture_content_type"
    t.integer  "profile_picture_file_size"
    t.datetime "profile_picture_updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["full_name"], name: "index_users_on_full_name", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  add_foreign_key "comments", "photos"
  add_foreign_key "comments", "users"
  add_foreign_key "follows", "users"
  add_foreign_key "follows", "users", column: "follower_id"
  add_foreign_key "likes", "photos"
  add_foreign_key "likes", "users"
  add_foreign_key "photos", "users"
  add_foreign_key "user_sessions", "users"
end
