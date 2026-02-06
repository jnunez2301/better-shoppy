# Better Shoppy Backend

This is the backend API for Better Shoppy, built with **Node.js**, **Express**, and **Sequelize**.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via Sequelize ORM)
- **Real-time**: Socket.IO
- **Auth**: JWT (JSON Web Tokens)

## Project Structure

```
backend/
├── config/         # Database and Environment configuration
├── controller/     # Request handlers (Auth, Cart, Product, Invitation)
├── middleware/     # Auth and Error handling middleware
├── model/          # Sequelize models (User, Cart, Product, Invitation)
├── routes/         # API Route definitions
├── service/        # Business logic layer
├── socket/         # Socket.IO event handlers
└── index.js        # Entry point
```

## API Reference

Base URL: `http://localhost:4000/api`

### Authentication

#### Register
Create a new user account.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "jdoe",
    "password": "secretpassword"
  }
  ```

#### Login
Authenticate a user and receive a JWT token.
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "jdoe",
    "password": "secretpassword"
  }
  ```

#### Get Current User
Get the profile of the currently logged-in user.
- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Update Profile
Update the current user's avatar.
- **URL**: `/auth/me`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "avatar": "avatar-3"
  }
  ```

### Carts

#### List Carts
Get all carts the user belongs to.
- **URL**: `/carts`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Create Cart
Create a new shopping cart.
- **URL**: `/carts`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Weekly Groceries"
  }
  ```

#### Get Cart Details
Get specific cart details and products.
- **URL**: `/carts/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Delete Cart
Delete a cart (Owner only).
- **URL**: `/carts/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

### Products

#### Add Product
Add a new item to the cart.
- **URL**: `/carts/:id/products`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Milk"
  }
  ```

#### Autocomplete
Get product suggestions based on name.
- **URL**: `/carts/:id/products/autocomplete?q=mil`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Invitations

#### Create Invitation
Invite a user to a cart.
- **URL**: `/carts/:id/invitations`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "invitedUsername": "friend123",
    "role": "editor" // 'editor' or 'viewer'
  }
  ```

#### Accept Invitation
Accept a pending invitation.
- **URL**: `/invitations/:token/accept`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`

## Real-time Events (WebSockets)

The backend emits events to the room `cart-{cartId}`:
- `product-added`: New product added
- `product-updated`: Product status or name changed
- `product-deleted`: Product removed
- `cart-cleared`: All products removed
- `user-joined` / `user-left`: Active users in cart

## Running Locally

1.  **Install Dependencies**:
    ```bash
    bun install
    ```
2.  **Start Server**:
    ```bash
    bun run start
    # or for dev with hot-reload
    bun run dev
    ```
