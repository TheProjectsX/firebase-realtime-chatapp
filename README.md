# Chat Room 2.0!

A test project to Test the Firebase Realtime Database.
Though it is a Test project, but a Useful one!
Created a Chat Room using below Technologies!

### Technologies:

- Next JS
- Firebase
- react-firebase-hooks
- ChatGPT

### UI Design:

Mostly done by ChatGPT. Described and Modified Design by your very Own!

### Database Schema

Only writing this Schema for Understanding purpose
As this is Only a Test project to understand the Firebase Realtime Database, so, not using Name field. Take it as a Anonymous Chat Group!

```
FirebaseDatabase {
    chatroom {
        [UniqueKey]: {
            uid: [UserUID],
            message: [UserMessage],
            createdAt: [CreateTime]
        }
    }
}
```
