# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
class Seeder
  def self.seed(query, subspace = "")
    subspace += subspace.length > 0 ? "/" : ""
    agent = Mechanize.new
    agent.log = Logger.new "mech.log"
    agent.user_agent_alias = 'Mac Safari'
    agent.pluggable_parser.default = Mechanize::FileSaver

    page = agent.get "http://www.google.com/"
    search_form = page.form_with :name => "f"
    search_form.field_with(:name => "q").value = query

    search_results = agent.submit search_form
    search_results = agent.click("Images")

    image_links = search_results.image_urls

    image_links.each_with_index do |image_url, idx|
      p image_url.to_s
      img = (agent.get image_url.to_s)
      img.save!("seed_data/#{subspace}#{query}/#{idx}-#{img.filename}.jpg")
    end
    Dir["seed_data/#{subspace}#{query}/*"]
  end

  def self.add_from_query_to(user, *query)
    files = query.inject([]) do |accum, query|
      accum.concat seed(query)
    end
    files.shuffle.each do |file|
      user.photos.create photo: File.open(file)
    end
    user
  end
end

User.create({
  username: "admin",
  password: "password",
  email: "admin@nstagr.am",
  full_name: "admin"
})
admin = User.find(1)
Seeder.add_from_query_to admin, "George Stubbs", "Yayoi Kusama"
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

# seed("North West").each do |file|
#   kim_k.photos.create! photo: File.open(file)
# end

Seeder.add_from_query_to kim_k, "North West", "Kim Kardashian Eating"

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
