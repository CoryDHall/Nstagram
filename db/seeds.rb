# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#
#
admin = User.create({
  username: "admin",
  password: "password",
  email: "admin@nstagr.am",
  full_name: "admin"
})

UserFactory.add_photos_to admin, "art history", "architecture"
UserFactory.get_profile_picture_from_tumblr admin, "caravaggio"


kim_k = User.create({
  username: "kimkardashian",
  password: "password",
  email: Faker::Internet.safe_email("kimkardashian"),
  full_name: "Kim Kardashian West"
})

UserFactory.add_photos_to kim_k, "North West"
UserFactory.get_profile_picture_from_tumblr kim_k, "Kim Kardashian Pregnant"



UserFactory.create_user_with_photos "arya stark"

UserFactory.create_user_with_photos "jerry gurgich"

UserFactory.create_user_with_photos "pikachu"

nobodies = []

100.times do
  user = UserFactory.create_user
  user.follow(kim_k);
  nobodies << user
end


users = User.order_by_num_photos.to_a

nobodies.each do |nobody|
  rand(100).times do
    UserFactory.follow_random nobody, users
  end
  UserFactory.lock_user nobody
  nobody.save
end
