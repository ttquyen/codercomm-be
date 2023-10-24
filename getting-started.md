# CoderComm

## Functional Specification

## User Stories

### Authentication

- [ ] As a user, I can register for a new account with name, email and password.
- [ ] As a user, I can sign in with my email and password.

### Users

- [ ] As a user, I can see a list od other users so that I can send, accept, or decline friend requests.
- [ ] As a user, I can get my current profile info (stay signed in with refreshing page).
- [ ] As a user, I can see a profile of a specific user given a user Id.
- [ ] As a user, I can update my profile info like Avatar, Company, Job Title, Social Links, and short description

### Posts and Comments

- [ ] As a user, I can see a list of posts of one user.
- [ ] As a user, I can create a mew post with text content and an image.
- [ ] As a user, I can edit my posts.
- [ ] As a user, I can delete my posts.
- [ ] As a user, I can see a list of comments on a post.
- [ ] As a user, I can write comments on a post.
- [ ] As a user, I can update my comments.

### Reactions

- [ ] As a user, I can react like or dislike to a post or a comment.

### Friends

- [ ] As a user, I can
- [ ] As a user, I can
- [ ] As a user, I can

## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Login with username and password
 * @body {email, password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route POST /users
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */
```

```javascript
/**
 * @route GET /users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */
```

### Post APIs
