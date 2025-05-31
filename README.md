# Prisma ORM Backend Project

This is a backend project built using **Prisma ORM**, created by me for a **school project**.

## Features

- User registration with email and password
- User login with JWT authentication
- Role assignment on login
- Admin capabilities:
  - Edit user roles
  - Block/unblock users
  - Remove users

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL or MySQL (your DB here)
- JWT for authentication
- Bcrypt for password hashing

## Main Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in and receive a JWT token with role
Admin only:
- `POST /api/v1/admin/add-role` - adds a role to a user
- `POST api/v1/admin/remove-role` - removes a role from a user
- `POsT api/v1/admin/block-user` - blocks a user from getting their token, therefore not being able to do anything
- `POsT api/v1/admin/unblock-user` - unblocks a user
- `POsT api/v1/admin/delete-user` - deletes a user

