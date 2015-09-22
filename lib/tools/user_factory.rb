class UserFactory
  def self.create_user(name = nil, profile_picture_query = nil)
    profile_picture_query ||= "#{%w(grumpy happy fat funny lol sad hungry).sample} #{%w(cat kitty dog puppy).sample}"
    joins = %w(_ __ ___ - x)
    
    tries = 0;
    begin
      tries += 1
      name ||= Faker::Name.name
      user = User.create({
        username: Faker::Internet.user_name(name, joins),
        password: "password",
        email: Faker::Internet.safe_email(name),
        full_name: name,
        bio: Faker::Lorem.sentence,
        website_url: Faker::Internet.url
      })
    rescue
      name = nil
      retry unless tries > 10
    end

    tries = 0;
    begin
      tries += 1
      Seeder.get_profile_picture_from_tumblr user, profile_picture_query
    rescue
      retry unless tries > 10
    end
    user
  end

  def self.give_photos_time (user)
    user.photos.to_a.each do |photo|
      photo.update created_at: rand(100000).minutes.ago
    end
    user
  end

  def self.add_photos_to (user, *query)
    Seeder.add_from_tumblr_to user, *query
    give_photos_time user
  end
end
