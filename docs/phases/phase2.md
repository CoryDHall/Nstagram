# Phase 2: Uploading and Viewing Photos, User profile pages, Photo feed

## Rails
### Models
* `Photo`


### Controllers
* `Api`
* `Api::UsersController` (create, update, show)
* `Api::PhotosController` (create, show, destroy)

### Views
* `user/show.json.jbuilder`
* `photo/show.json.jbuilder`

## Backbone
### Models
* `User`
* `Photo`

### Collections
* `Users`
* `Photos`

### Views
* `UserNew`
* `UserShow` (composite view, contains PhotosIndex using User's `has_many` photos association)
* `UserEdit`
* `SessionNew`
* `Feed` (composite view, contains PhotosIndex using `current_user`'s `has_many` photos, through `follows`')
* `PhotoShow`
* `PhotosIndex` (composite view, contains PhotoShow)
* `PhotoNew`

## Gems/Libraries
* `paperclip`
* `ImageMagick`
