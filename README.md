# nstagram

[Heroku link][heroku]

[heroku]: #

## Minimum Viable Product
nstagram is a clone of Instagram built on Rails and Backbone. Users can:


- [ ] Create accounts
- [ ] Create sessions (log in)
- [ ] Upload photos
- [ ] View photos
- [ ] Like photos
- [ ] Leave comments on photos
- [ ] Follow other users
- [ ] View a feed of followed user's photos
- [ ] Use user handles and hashtags in photo descriptions and comments as links
- [ ] Search for photos by hashtag
- [ ] Search for users by username
- [ ] Tag users in a photo
- [ ] Geotag their photos
- [ ] View other photos uploaded/taken at the same location
- [ ] Receive notifications

## Design Docs


## Implementation Timeline

### Phase 1: User Authentication, Follow Users, User Search (~1 day)
I will implement user authentication in Rails. This will establish the framework for all user interactions. By the end of this phase, users will be able to create accounts, log in, find other users, and follow/unfollow users.

[Details][phase-one]

### Phase 2: Uploading and Viewing Photos, User profile pages, Photo feed (~2 days)
I will first integrate **Paperclip** for file upload and viewing. I will then add API routes to serve user and photo data as JSON, then add Backbone models and collections that fetch data from those routes. By the end of this phase, users will be able to upload photos, view photos, view other user's photos, and view their feed of followed users' photos, all inside a single Backbone app.

[Details][phase-two]

### Phase 3: Likes, Comments, Tagging (~2 days)
I will add routes to retrieve and set the data that interconnects the app (likes, comments, phototags, '@username', and '#hashtag'). By the end of this phase the user will be able to interact with the content available to them.

[Details][phase-three]

### Phase 4: Geotagging (~1-2 days)
I will integrate **Geokit** to add real location data to uploaded photos. I will then add routes to link and retrieve those associations. By the end of this phase the user will be able to enter a geotag with their photo and view other photos with the same location name.

[Details][phase-four]

### Phase 5: Receive notifications (~1-2 days)
I will add routes to retrieve interaction activity (new table rows linking to a user's associations). In Backbone, I will display a list of notifications. By the end of this phase, the user will be able to view a list of all interactions with their content and receive live visual feedback of new interactions.

[Details][phase-five]

### Bonus Features (TBD)
- [ ] Filter/Edit Photos
- [ ] View activity of followed users
- [ ] View a map of their photos' location data
- [ ] Make their accounts private
- [ ] Embed a live view of public content
- [ ] Admin
- [ ] Block Users
- [ ] Report content
- [ ] Explore a collection of photos based upon followed users' activity

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md
