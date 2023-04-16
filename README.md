# Real Time Chat App

In this app user can signup and login to the application and can access chatting facility.
User can create new room or can join existing rooms and can start conversation with other users.


## Tech Stack

**Client:** React.js

**Server:** Node, Express, MongoDb

**Real time message:** Socket.io


## Testing

To test this project 

At first clone the git repo
```bash
  git clone https://github.com/Tusharg376/FSOC-BE.git
```

then install all the dependencies

```bash
  npm install
```
then start the server 

```bash
  npm run start
```

## Demo

- https://talkiesspot.onrender.com/


## Models
- User Model
```yaml
{ 
  name: {string, mandatory},
  email: {string, mandatory, valid email, unique},
  profileImage: {string, mandatory}, 
  phone: {string, mandatory, unique}, 
  password: {string, mandatory, minLen 8, maxLen 15}, 
  rooms:{objectId,ref:'room'}
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```
- Room Model
```yaml
{ 
  roomName: {string, mandatory},
  users: {objectId, ref:'user'},
  roomAdmin: {objectId, ref:'user'},
  isPrivate: {Boolean, default:false},
  profile:{string},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```
- Message Model
```yaml
{ 
  sender: {objectId, ref:'user'},
  content: {string, mandatory},
  roomID: {objectId,ref:'room'},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```
## API Reference

#### create user 

```http
  POST  /createuser
```
user can create his account 

#### user login

```http
  POST /login
```
user can login into his account

#### user profile update (protected)

```http
  PUT /updateUser
```
user can update his profile picture and his name 

#### get all rooms 

```http
  get /rooms
```
for fetching all rooms data

#### create room

```http
  POST /createRoom
```
user can create a room

#### add a member in room(protected)

```http
  POST /addMember/:roomId
```
user can add members in existing room

#### rename room(protected)

```http
  PUT /renameRoom/:roomId
```
user can rename his room

#### remove a member from room(protected)

```http
  PUT /removeMember/:roomId
```
user can remove a member from his room

#### search all rooms by room name(login required)

```http
  GET /searchRoom
```
for search operation 

#### send message(protected)

```http
  POST /sendMessage/:roomId
```
user can send message

#### get all messages(protected)

```http
  GET /allMessages/roomId
```
to get all the message data of perticular room

## environment variables

**url:** mongo DB connection string

**port:** port for running server on local

**secretKey:** jwt secret key 
