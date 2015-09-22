# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


User.create({
  username: "admin",
  password: "password",
  email: "admin@nstagr.am",
  full_name: "admin"
})
admin = User.find(1)
Seeder.add_from_tumblr_to admin, "George Stubbs", "Yayoi Kusama"
Seeder.get_profile_picture_from_tumblr admin, "pastorale"


User.create({
  username: "kimkardashian",
  password: "password",
  email: Faker::Internet.safe_email("kimkardashian"),
  full_name: "Kim Kardashian West"
})
kim_k = User.find_by(username: "kimkardashian")
kim_k.update({
  profile_picture: kim_k.photos.to_a.sample
});

Seeder.add_from_tumblr_to kim_k, "North West"
Seeder.get_profile_picture_from_tumblr kim_k, "Kim Kardashian Fat"


100.times do
  UserFactory.create_user.follow(kim_k);
end

UserFactory.add_photos_to UserFactory.create_user("bubbles", "powerpuff girls"), "powerpuff girls"

UserFactory.add_photos_to UserFactory.create_user("jerry gurgich", "jerry gurgich"), "jerry gurgich"

UserFactory.add_photos_to UserFactory.create_user("pikachu", "pikachu"), "pikachu"
