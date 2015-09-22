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
# (seed("George Stubbs") + seed("Yayoi Kusama")).shuffle.each do |file|
#   admin.photos.create photo: File.open(file)
# end

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

# seed("North West").each do |file|
#   kim_k.photos.create! photo: File.open(file)
# end

Seeder.add_from_tumblr_to kim_k, "North West", "Kim Kardashian Fat"

joins = %w(_ __ ___ - x)
100.times do
  name = Faker::Name.name
  until User.create({
    username: Faker::Internet.user_name(name, joins),
    password: "password",
    email: Faker::Internet.safe_email(name),
    full_name: name,
    bio: Faker::Lorem.sentence,
    website_url: Faker::Internet.url
  })

  end
  User.last.follow(kim_k);
end
