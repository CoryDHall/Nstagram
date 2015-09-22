# nstagram

[Heroku link][heroku]

[heroku]: http://nstagram.herokuapp.com/

## Minimum Viable Product
nstagram is a clone of Instagram built on Rails and Backbone. Users can:


- [x] Create accounts
- [x] Create sessions (log in)
- [x] Upload photos
- [x] View photos
- [ ] Like photos
- [ ] Leave comments on photos
- [x] Follow other users
- [x] View a feed of followed user's photos
- [ ] Use user handles and hashtags in photo descriptions and comments as links
- [ ] Search for photos by hashtag
- [ ] Search for users by username
- [ ] Tag users in a photo
- [ ] Name locations in their photos
- [ ] View other photos uploaded/taken at the same location
- [ ] Receive notifications

## Design Docs
* [Schema][schema]

[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: User Authentication, Follow Users (~2 days) [Completed]
I will implement user authentication in Rails. This will establish the framework for all user interactions. By the end of this phase, users will be able to create accounts, log in, view other users, and follow/unfollow users.

[Details][phase-one]

### Phase 2: Uploading and Viewing Photos, User profile pages, Photo feed (~2 days) [Completed]
I will first integrate **Paperclip** for file upload and viewing. I will then add API routes to serve user and photo data as JSON, then add Backbone models and collections that fetch data from those routes. By the end of this phase, users will be able to upload photos, view photos, view other user's photos, and view their feed of followed users' photos, all inside a single Backbone app.

[Details][phase-two]

### Phase 3: Likes, Comments, Tagging (~2 days)
I will add routes to retrieve and set the data that interconnects the app (likes, comments, phototags, '@username', and '#hashtag'). By the end of this phase the user will be able to interact with and set connections on the content available to them.

[Details][phase-three]

### Phase 4: 'Locations' (~1 day)
I will add routes to allow users to **name** a location with their uploaded photos. I will then add routes to link and retrieve those associations. By the end of this phase the user will be able to enter a location with their photo and view other photos with the same location name.

[Details][phase-four]

### Phase 5: User/Hashtag Search (~1-2 days)
I will add routes to retrieve results of partial/fuzzy searching. By the end of this phase, the user will be able to directly search for a user/hashtagg, or implicitly and dynamically search while creating a new comment.

[Details][phase-five]

### Phase 6: Receive notifications (~1-2 days)
I will add routes to retrieve interaction activity (new table rows linking to a user's associations). In Backbone, I will display a list of notifications. By the end of this phase, the user will be able to view a list of all interactions with their content and receive live visual feedback of new interactions.

[Details][phase-six]

### Bonus Features (TBD)
- [ ] Filter/Edit Photos
- [ ] View activity of followed users
- [ ] Add real Geotags their photos
- [ ] Have multiple sessions
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
[phase-six]: ./docs/phases/phase6.md
