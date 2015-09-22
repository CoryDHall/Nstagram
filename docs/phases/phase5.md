# Phase 5: Search

## Rails
### Models
* `User`
* `Hashtag`
* `Location`

### Controllers
* `API::Controller` (search)

### Views
* `users/search.json.jbuilder`
* `hashtags/search.json.jbuilder`
* `locations/search.json.jbuilder`

## Backbone
### Models

### Collections

### Views
* `HashtagSearch`(composite view, contains `_search` partial)
* `UserSearch` (composite view, contains `_search` partial)
* `LocationSearch` (composite view, contains `_search` partial)
* `_search`

## Gems/Libraries
pg_search
