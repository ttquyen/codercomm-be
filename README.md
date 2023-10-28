# CoderComm

## Functional Specification

CoderComm is a social network that allows people to join by creating accounts. Each user should provide a name, an email, and password to create a new account. The email address should not link to any account in the system.

After joining the CoderComm, users can update their profile info like Avatar, Company, Job title, Social links, and a short description about themselves.

Users can write Posts that contain text content and an image. The new posts will be shown on the user profile page, allowing other user to comment. Users can also react with like or dislike on a post or a comment.

User can send requests to other users who have an open relationship with them. Users can accept or reject a friend request. After accepting a friend request, both become friends, and they can see posts of each other.

## User Stories

### Authentication

-   [x] As a user, I can register for a new account with name, email and password.
-   [x] As a user, I can sign in with my email and password.

### Users

-   [x] As a user, I can see a list od other users so that I can send, accept, or decline friend requests.
-   [x] As a user, I can get my current profile info (stay signed in with refreshing page).
-   [x] As a user, I can see a profile of a specific user given a user Id.
-   [x] As a user, I can update my profile info like Avatar, Company, Job Title, Social Links, and short description

### Posts and Comments

-   [x] As a user, I can see a list of posts of one user.
-   [x] As a user, I can create a mew post with text content and an image.
-   [x] As a user, I can edit my posts.
-   [x] As a user, I can delete my posts.
-   [x] As a user, I can see a list of comments on a post.
-   [x] As a user, I can write comments on a post.
-   [x] As a user, I can update my comments.

### Reactions

-   [x] As a user, I can react like or dislike to a post or a comment.

### Friends

-   [x] As a user, I can see a list of users in system.
-   [x] As a user, I can search a user by name in the user list of system.
-   [x] As a user, I can send friend requests to another users.
-   [x] As a user, I can cancel my friend request.
-   [x] As a user, I can accept or reject an incoming friend request.
-   [x] As a user, I can see my friend list.
-   [x] As a user, I can remove my friends.

## Endpoint APIs

Please refer [getting-started](docs/getting-started.md) in document for more info mation

## Installation

-   Please refer `.env.example` and add a new `.env` file in the same root.
-   Run: `npm install` to install all packages and dependencies.
-   Run: `npm run dev`
    The server is running on the port you set in `.env` for now.
