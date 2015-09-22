class Seeder
  def self.seed_from_google(query, subspace = "")
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

  def self.seed_from_tumblr(query, subspace = "")
    subspace += subspace.length > 0 ? "/" : ""
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
    image_links.each_with_index do |image_url, idx|
      p image_url.to_s.sub(/_500./, "_1280.")
      if (image_url.to_s[/\Adata:|\/p\?/].nil?)&& image_url.to_s.length < 256
        p "-----"
        begin
          img = (agent.get image_url.to_s.sub(/_500./, "_1280."))
          img.save!("seed_data/#{subspace}#{query}/#{idx}-#{img.filename}")
        rescue
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
      accum.concat seed_from_tumblr(query)
    end
    files.shuffle.each do |file|
      user.photos.create photo: File.open(file)
    end
    user
  end
end
