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

```javascript
/**
 * @route PUT /users/:id
 * @description Update a user profile
 * @access Login required
 */
```

### Post APIs

```javascript
/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route POST /posts
 * @description Create a new post
 * @body {content, image}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */
```

```javascript
/**
 * @route GET /posts/:id/comments
 * @description Get comments of a post
 * @access Login required
 */
```

### Comment APIs

```javascript
/**
 * @route POST /comments
 * @description Create a new comment
 * @body {content, postId}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /comments/:id
 * @description Get detail of a comment
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /comments/:id
 * @description Delete a comment
 * @access Login required
 */
```

### Reaction APIs

```javascript
/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @body {targetType: 'Post' or 'Comment', targetid, emoji: 'like' or 'dislike'}
 * @access Login required
 */
```

### Friend APIs

```javascript
/**
 * @route POST /friends/requests
 * @description Send a friend request
 * @body {to:userID}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of sent pending requests
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends
 * @description Get the list of friends
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body {status:'accepted' or 'declined'}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /friends/:userId
 * @description Remove a friend
 * @access Login required
 */
```
