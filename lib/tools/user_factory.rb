class UserFactory
  def self.create_user(name = nil)
    joins = %w(_ __ - x)

    user = nil
    try_only_n_times 10 do
      name ||= Faker::Name.name
      user ||= User.create!(
        username: Faker::Internet.user_name(name, joins),
        password: "password",
        email: Faker::Internet.safe_email(name),
        full_name: name,
        bio: Faker::Name.title,
        website_url: Faker::Internet.url
        )
      end
      user
    end

    def self.create_user_with_photos(name_and_query)
      user = nil
      try_only_n_times 5 do
        user ||= create_user name_and_query
        get_profile_picture_from_tumblr user, name_and_query
        add_photos_to user, name_and_query
        user.save!
      end

      user
    end

    def self.create_a_full_user(name_and_query, users_to_follow = nil, lock = false)
      user = nil
      users_to_follow ||= User.order_by_num_photos.to_a
      try_only_n_times 5 do
        user ||= create_user_with_photos name_and_query
        rand(User.count).times do
          follow_random user, users_to_follow
        end
        photos = Photo.order_by_popularity.to_a
        rand(Photo.count).times do
          like_random user, photos
          comment_random user, photos
        end
        lock_user user if lock
        user.save!
      end
      user
    end

    def self.get_profile_picture_from_tumblr(user, profile_picture_query = nil)
      profile_picture_query ||= "#{%w(grumpy happy funny lol hungry).sample} #{%w(cat kitty dog puppy).sample}"
      try_only_n_times 10 do
        Seeder.get_profile_picture_from_tumblr user, profile_picture_query
      end
      user
    end

    def self.make_from_auth(auth, name)
      user = auth.build_user
      user.email = "#{auth.uid}.#{auth.provider}@nst-gr-m.x"
      user.username = "#{name.gsub(/\W/,"_")}_#{SecureRandom::urlsafe_base64(3).squeeze}".downcase
      user.full_name = name
      lock_user user
      user.save
      user
    end

    def self.lock_user (user)
      try_only_n_times 10 do
        user.update! password: SecureRandom::urlsafe_base64(12)
      end

      user
    end

    def self.give_photos_time (user)
      user.photos.to_a.each do |photo|
        photo.update created_at: rand(100000).seconds.ago
      end
      user
    end

    def self.add_photos_to (user, *query)
      Seeder.add_from_tumblr_to user, *query
      give_photos_time user
    end

    def self.follow_random (user, users = nil)
      users ||= User.order_by_num_photos.to_a

      try_only_n_times 5 do
        index = Math.sqrt(rand(users.count)).floor
        user.follow users[index]
      end

      try_only_n_times 5 do
        index = rand(users.count)
        user.follow users[index]
      end

      user
    end

    def self.like_random (user, photos = nil)
      photos ||= Photo.order_by_popularity.to_a

      try_only_n_times 5 do
        index = Math.sqrt(rand(photos.count)).floor
        user.like photos[index]
      end

      try_only_n_times 5 do
        index = rand(photos.count)
        user.like photos[index]
      end
      user
    end

    def self.comment_random (user, photos = nil)
      photos ||= Photo.order_by_popularity.to_a
      body = ["@#{user.following.select(:username).sample.username}",
        "##{Faker::Commerce.product_name.gsub(/\W/, "")}"] +
        Faker::Hacker.say_something_smart.scan(/[\w\s^']+/)

      try_only_n_times 1 do
        index = Math.sqrt(rand(photos.count)).floor
        photos[index].comments.create(user: user, body: body.shuffle.join(" "))
      end

      try_only_n_times 2 do
        index = rand(photos.count)
        photos[index].comments.create(user: user, body: body.shuffle.join(" "))
      end

      user
    end

    private

    def self.try_only_n_times (n, &prc)
      tries = 0;
      begin
        tries += 1
        prc.call
      rescue
        retry unless tries > n
      else
        return true
      end
      false
    end
  end
