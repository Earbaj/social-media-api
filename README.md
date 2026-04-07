# Social Media API (NestJS + MongoDB)

A robust and scalable Social Media API built with **NestJS**, **Mongoose (MongoDB)**, and **JWT Authentication**. This API allows users to register, login, follow/unfollow others, create posts, like/unlike posts, and view a personalized news feed.

## 🚀 Features

-   **Authentication**: Secure registration and login using JWT and password hashing (bcrypt).
-   **User Management**: Follow and unfollow users to build your network.
-   **Profile**: View your own profile with follower/following counts.
-   **Posts**: Create posts with text content.
-   **Interactions**: Like and unlike posts.
-   **News Feed**: A dynamic feed showing posts from yourself and the users you follow, sorted by the latest first.

## 🛠️ Tech Stack

-   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
-   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Authentication**: JWT (JSON Web Token)
-   **Validation**: Class-validator (implicit via NestJS)
-   **Security**: Bcrypt for password hashing

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd social-media-api
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following (refer to `example.env`):
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1d
    PORT=4000
    ```

4.  **Run the Application**:
    ```bash
    # Development mode
    npm run start:dev

    # Production mode
    npm run start:prod
    ```

---

## 📖 API Documentation

### 1. Authentication Module (`/auth`)

#### **Register User**
Create a new user account.
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "username": "earbaj",
    "email": "earbaj@example.com",
    "password": "strongpassword123",
    "bio": "Software Engineer & Tech Enthusiast"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "_id": "65f1a...",
    "username": "earbaj",
    "email": "earbaj@example.com",
    "bio": "Software Engineer & Tech Enthusiast",
    "followers": [],
    "following": [],
    "createdAt": "2024-03-12T...",
    "updatedAt": "2024-03-12T..."
  }
  ```

#### **Login User**
Authenticates a user and returns a JWT token.
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "earbaj@example.com",
    "password": "strongpassword123"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```

---

### 2. User Module (`/users`)
*Authorization required for all endpoints.*

#### **Get My Profile**
Fetch the current logged-in user's profile data.
- **Endpoint**: `GET /users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200 OK):
  ```json
  {
    "_id": "65f1a...",
    "username": "earbaj",
    "email": "earbaj@example.com",
    "bio": "...",
    "followers": [
      { "_id": "...", "username": "friend1", "profilePic": "..." }
    ],
    "following": [],
    "createdAt": "..."
  }
  ```

#### **Follow/Unfollow User**
Toggle follow/unfollow for a target user.
- **Endpoint**: `POST /users/follow/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Path Param**: `:id` (ID of the user to follow/unfollow)
- **Success Response** (200 OK):
  ```json
  {
    "message": "Followed successfully" // or "Unfollowed successfully"
  }
  ```

---

### 3. Posts Module (`/posts`)
*Authorization required for all endpoints.*

#### **Create Post**
Create a new post.
- **Endpoint**: `POST /posts`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "content": "Hello world! This is my first post on this awesome API."
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "_id": "65f2b...",
    "content": "Hello world!...",
    "author": "65f1a...",
    "likes": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

#### **Get News Feed**
Get posts from yourself and users you follow.
- **Endpoint**: `GET /posts/feed`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200 OK):
  ```json
  [
    {
      "_id": "65f2b...",
      "content": "Hello world!...",
      "author": {
        "_id": "65f1a...",
        "username": "earbaj",
        "profilePic": "..."
      },
      "likes": ["65f3c..."],
      "createdAt": "2024-03-12T..."
    }
  ]
  ```

#### **Like/Unlike Post**
Toggle like/unlike for a specific post.
- **Endpoint**: `POST /posts/:id/like`
- **Headers**: `Authorization: Bearer <token>`
- **Path Param**: `:id` (ID of the post to like/unlike)
- **Success Response** (200 OK):
  ```json
  {
    "message": "Post liked" // or "Post unliked"
  }
  ```

---

## 🛡️ License
Distributed under the MIT License.
