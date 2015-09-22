class Seeder
  def self.seed_from_google (query, subspace = "")
    subspace += subspace.length > 0 ? "/" : ""

    remove_old_seeds query, subspace

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

  def self.seed_from_tumblr(query, subspace = "", only_one = false)
    subspace += subspace.length > 0 ? "/" : ""

    remove_old_seeds query, subspace

    agent = Mechanize.new
    agent.log = Logger.new "mech.log"
    agent.user_agent_alias = 'Mac Safari'
    agent.pluggable_parser.default = Mechanize::FileSaver

    page = agent.get "http://www.tumblr.com/"

    save_dir = "seed_data/#{subspace}#{query}/"

  rescue
    retry
  else
    search_form = page.form_with :id => "search_form"
    search_form.field_with(:name => "q").value = query

    search_results = agent.submit search_form

    image_links = search_results.image_urls
    p
    if only_one
      fetch_and_save_images image_links, save_dir, 1
    else
      fetch_and_save_images image_links, save_dir
    end
    only_one ? Dir["#{save_dir}/*"].last : Dir["#{save_dir}/*"]
  end

  def self.fetch_and_save_images (image_urls, save_to_dir, limit = nil)
    agent = Mechanize.new
    agent.log = Logger.new "mech.log"
    agent.user_agent_alias = 'Mac Safari'


    limit ||= image_urls.length
    success = 0

    image_urls.shuffle.each_with_index do |image_url, idx|
      return if success >= limit

      print "FETCHING:\t\t", image_url.to_s.sub(/_500./, "_1280.").center(80, "=")
      if (image_url.to_s[/\Adata:|\/p\?/].nil?)&& image_url.to_s.length < 256
        puts "", " VALID ".center(80, "=")
        begin
          success += 1
          img = (agent.get image_url.to_s.sub(/_500./, "_1280."))
          raise "invalid img" if img.nil?
          print "----SAVING TO:\t\t", "#{save_to_dir}#{idx}-#{img.filename}"
          puts "-".center(80, "~")
          img.save!("#{save_to_dir}#{idx}-#{img.filename}")
        rescue
          success -= 1
        end
        puts "SUCCESS".center(80, "="), ""
      end
    end
    success
  end

  def self.add_from_google_to(user, *query)
    files = query.inject([]) do |accum, query|
      accum.concat seed_from_google(query)
    end
    files.shuffle.each do |file|
      user.photos.create photo: File.open(file)
    end
    user
  end

  def self.add_from_tumblr_to(user, *query)
    files = query.inject([]) do |accum, query|
      puts "SCRAPING:\t\t[TUMBLR]:\t\t#{query}".center(80, "=")
      accum.concat seed_from_tumblr(query)
    end
    photo_list = [];
    files.shuffle.each do |file|
      puts "ADDING:\t\t[#{file}]", "TO:\t\t[#{user.username}]".center(80, "+")
      photo_list << {photo: File.open(file)}
    end
    puts "SAVING".center(80, "=")
    user.photos.create photo_list

    puts "SUCCESS: ADDED #{photo_list.count} PHOTOS".center(80, "=")
    user
  end

  def self.get_profile_picture_from_tumblr(user, query)
    puts "SCRAPING:\t\t[TUMBLR]:\t\t#{query}".center(80, "=")
    file = seed_from_tumblr query, "profile_picture", true
    if !!file
      puts "ADDING:\t\t[#{file}]", "TO:\t\t[#{user.username}]"
      user.update(profile_picture: File.open(file))
      puts "SUCCESS".center(80, "=")
      user
    else
      puts "UNABLE TO FIND PROFILE PICTURE WITH:\t#{query}".center(80, "!")
      user
    end
  end

  def self.remove_old_seeds (query, subspace)
    old_seeds = Dir["seed_data/#{subspace}#{query}/*"]
    old_seeds.each do |seed|
      puts "DELETING:\t\t#{seed}".center(80, "=")
      File.delete seed
    end
  end
end
