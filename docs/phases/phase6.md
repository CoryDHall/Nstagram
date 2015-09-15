# Phase 5: Receive Notifications

## Rails
### Models
* `Interaction`

### Controllers
* `Api::InteractionsController` (create, index, show)

### Views
* `interactions/show.json.jbuilder`
* `interactions/index.json.jbuilder`

## Backbone
### Models
* `Interaction`

### Collections
* `Interactions`

### Views
* InteractionsIndex **Notifications** (composite view, contains InteractionsShow)
* InteractionsShow
* NewInteractionsIndex

## Gems/Libraries
* ??? 
