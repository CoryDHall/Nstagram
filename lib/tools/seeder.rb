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
    search_form = page.form_with :id => "search_form"
    search_form.field_with(:name => "q").value = query

    search_results = agent.submit search_form

    image_links = search_results.image_urls
    p
    if only_one
      image_url = image_links.sample

    begin
      p image_url.to_s.sub(/_500./, "_1280.")
      if (image_url.to_s[/\Adata:|\/p\?/].nil?)&& image_url.to_s.length < 256
        p "-----"
          img = (agent.get image_url.to_s.sub(/_500./, "_1280."))
          img.save!("seed_data/#{subspace}#{query}/#{img.filename}")
      end
    rescue
      image_url = image_links.sample
      retry
    end
      return Dir["seed_data/#{subspace}#{query}/#{img.filename}"]
    else
      image_links.each_with_index do |image_url, idx|
        print "FETCHING:\t\t", image_url.to_s.sub(/_500./, "_1280.")
        if (image_url.to_s[/\Adata:|\/p\?/].nil?)&& image_url.to_s.length < 256
          puts "\n-----VALID"
          begin
            img = (agent.get image_url.to_s.sub(/_500./, "_1280."))
            print "----SAVING TO:\t\t", "seed_data/#{subspace}#{query}/#{idx}-#{img.filename}"
            img.save!("seed_data/#{subspace}#{query}/#{idx}-#{img.filename}")
          rescue
          end
          puts "SUCCESS", ""
        end
      end
    end
    Dir["seed_data/#{subspace}#{query}/*"]
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
      puts "SCRAPING:\t\t[TUMBLR]:\t\t#{query}"
      accum.concat seed_from_tumblr(query)
    end
    files.shuffle.each do |file|
      puts "ADDING:\t\t[#{file}]", "TO:\t\t[#{user.username}]"
      user.photos.create photo: File.open(file)
    end
    user
  end

  def self.get_profile_picture_from_tumblr(user, query)
    file = seed_from_tumblr query, "profile_picture", true
    user.update profile_picture: File.open(file[0])
  end

  def self.remove_old_seeds (query, subspace)
    old_seeds = Dir["seed_data/#{subspace}#{query}/*"]
    old_seeds.each do |seed|
      puts "DELETING:\t\t#{seed}"
      File.delete seed
    end
  end
end
