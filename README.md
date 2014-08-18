### Coding Challenge: Food Truck Locator

### Technical Track: Full Stack

### Stack: 
* [Play 2.3](http://www.playframework.com): Web Framework
* [Slick 2.1](http://slick.typesafe.com/): DB Access/ORM
* [Backbone 1.1.2](http://backbonejs.org/) and [ReactJS 0.11](http://reactjs.org): Front-End

I chose this particular stack because I was most comfortable working with Scala to build out a quick, effective prototype. 
I'm comfortable working in JS and have some background with both Python and Ruby, but for demonstration purposes I felt
I'd be best served by using my primary language. 

Regarding the frontend choice, Backbone and React are my go-to choices for web UX. React is a lot lighter-weight than something
like Angular or Ember and focuses primarily on serving as the view layer; again it was chosen for familiarity. Backbone
is responsible for all the model level interactions.

### Trade-Offs, Limitations, and Wishlist
Things I wish I'd gotten done: 
* Test coverage - Non-existant

* Better controls/Better UX
    * List of possible results on address/location search - Currently just zooms to the first found.
    * Controls around # of trucks to display
    * Figuring out a good way to surface menu/content information
    * Two way hovers - Hovering an icon on the map should highlight it in the list
    * Better view bounding - It's possible to zoom to an address and end up with markers outside the field of view
    
* Secure Data loading endpoint - Some sort of admin authentication process.

### Links and Other notes
Public Profile: [LinkedIn](http://linkedin.com/in/katevonroeder)
