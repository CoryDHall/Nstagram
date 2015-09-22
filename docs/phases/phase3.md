# Phase 3: Content Interactions

## Rails
### Models
* `Like`
* `Comment`
* `PhotoTag`
* `Hashtag`

### Controllers
* `Api::LikesController` (create, index, destroy)
* `Api::CommentsController` (create, index, destroy)
* `Api::PhotoTagController` (create, destroy)
* `Api::Hashtag` (create, show, destroy)

### Views
* `likes/index.json.jbuilder`
* `comments/show.json.jbuilder`
* `hashtags/show.json.jbuilder`


## Backbone
### Models
* `Like`
* `Comment`
* `PhotoTag`
* `Hashtag`

### Collections
* `Likes`
* `Comments`
* `PhotoTags`
* `Hashtags`

### Views
* `LikesListOrCount`
* `PhotoLikesIndex` (composite view, contains LikesIndex using photo's `has_many` likes association)
* `UserLikesIndex` (composite view, contains LikesIndex using `current_user`'s `has_many` likes association)
* `PhotoCommentsIndex` (uses photo's `has_many` comments association)
* `PhotoTagsIndex` (uses user's `has_many` phototags association)
* `HashtagShow` (uses hashtag's `has_many` photos through its `has_and_belongs_to_many` comments association)

## Gems/Libraries
