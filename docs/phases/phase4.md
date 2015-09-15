# Phase 4: Locations

## Rails
### Models
* `Location`

### Controllers
* `Api::LocationsController` (create, show)

### Views
* `locations/show.json.jbuilder`

## Backbone
### Models
* `Location`

### Collections
* `Locations`

### Views
* `LocationShow`(composite view, contains PhotosIndex using Location's `has_and_belongs_to_many` photos association)


## Gems/Libraries
* ~~`geokit`~~ Save for Bonus
