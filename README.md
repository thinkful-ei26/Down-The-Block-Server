# [DownTheBlock](https://down-the-block.herokuapp.com)

## Welcome to DownTheBlock - Your Neighborhood at Your Fingertips
 DownTheBlock connects you with your neighborhood and provides a convenient way of staying informed. Whether you lost your pet, are throwing an event, or want to be aware of the latest criminal activity around you, DownTheBlock is here to help. Join today to stay up-to-date on everything happening close to home as well as in the broader community!
 
## Features (for registered users)
:white_check_mark: Upon registering, users will be asked for access to their location and subsequently connected with their own personal neighborhood

:white_check_mark: Users will be able to see, and post, in two different forums; the neighbors forum has a 1 mile geofence, while the city forum has a 5 mile geofence

:white_check_mark: Users can post, upload pictures, comment, filter, and search the forums in real-time

:white_check_mark: Users can search for and directly message their neighbors within a 1 mile radius for a more private experience

## App Screenshots

### Onboarding
<img src='./assets/onboarding.png' alt='Onboarding Screenshot' width='900px'/>

### Forum
<img src='./assets/forum.png' alt='Onboarding Screenshot' width='900px'/>

### Direct Messaging
<img src='./assets/chat.png' alt='Onboarding Screenshot' width='900px'/>

## Tech Specs: 
**Front-end:**
- React
- Redux
- Javascript
- Socket.io 
- HTML5
- Sass

**Back-end**
- Node
- Express
- MongoDB hosted on Atlas
- JWT 
- Passport 
- Socket.io 

**Workflow**
- Agile/SCRUM 

## Future Updates
:point_right: Send notifications when a user has an unread chat

:point_right: More diverse categories for posts

:point_right: Use pagination instead of infinite scroll 

:point_right: Display a map of user’s geofilter

## Team
<a href="https://github.com/nikmash711" target="_blank"> **Nikkie Mashian**</a>: Product Manager & Design Lead

<a href="https://github.com/ethanfrigon" target="_blank"> **Ethan Frigon**</a>: Project Manager

<a href="https://github.com/IllegalSkillsException-active" target="_blank"> **Taylor Merrill**</a>: QA Lead

<a href="https://github.com/stevezg" target="_blank"> **Steve Anderson**</a>: DevOps Lead

## Links
[Server Repo](https://github.com/thinkful-ei26/Down-The-Block-Server)

[Deployed Server On Heroku](https://down-the-block-server.herokuapp.com/)

[Deployed Client On Heroku](https://down-the-block.herokuapp.com)

[Project Management Trello Link](https://trello.com/b/hPCzbOTZ/neighborhood-watch "trello")

## Demo Info (Friends Edition)
**Since this is  a geolocation app, to properly see the pre-populated demo you must block your location on your browser**
- Account Username: ross
- Account Password: friends123

## Schema
### User
```
{
  firstName:  {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  photo: { type: Object },
  coordinates: { type: Object },
  pinnedChatUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}
```

### Post
```
{
  category: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  coordinates: { type: Object, required: true },
  photo: { type: Object },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audience: { type: String, required: true }
}
```

### Comment
```
{
  content: { type: String, required: true },
  date: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}
```

### Chat
```
{
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  namespace: { type: String }
}
```

### Message
```
{
  content: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true }
}
```

## API Overview
```        
/api
.
├── /auth
│   └── POST
│       ├── /login
│       ├── /refresh
│       └── /refresh-profile
├── /users
│   └── GET /:coords
│       └── /pinnedChatUsers
│   └── POST /
│   └── PUT
│       ├── /account
│       ├── /password
│       ├── /photo
│       └── /location/:coords
│   └── DELETE 
│       └── /pinnedChatUsers/:chatUserId
├── /posts
│   └── GET /:geo/:forum
│   └── POST /:geo/:forum
│   └── PUT /:postId
│   └── DELETE /:postId
├── /comments
│   └── POST /
│   └── PUT /:postId/:commentId
│   └── DELETE /:postId/:commentId
├── /chat
│   └── GET /:namespace/:userId1/:userId2
├── /message
│   └── POST /:namespace
│   └── PUT /:namespace
```


        
    
   
