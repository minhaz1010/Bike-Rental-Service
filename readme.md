# Bike Rental Service API

Welcome to the Bike Rental Service API. This backend service allows users to rent bikes, manage their profiles, and view available bikes. Admins can manage bike inventory and handle user rentals.

## Front-End
[Front-End](https://github.com/minhaz1010/Bike-Rental-Front-End)

## Live Link
[Bike-Rental-Service](https://bike-rental-service-node.vercel.app/)

## ER-Diagram 
![ER-Diagram](./ER.png)

## Requirement-Analysis
[Requirement-analysis](https://drive.google.com/file/d/144c1fo0Bn1OuU1FNCfvaD3X_4GpN8rRl/view?usp=drive_link)

## Table of Contents

- [Features](#features)
- [Technology Stack](#stack)
- [Installation](#installation)
- [Commands](#commands)
- [File Structure](#file-structure)

## Features

- **User Authentication:**
  - User Signup
  - User Login
  - Admin Signup
  - Admin Login

- **Profile Management:**
  - View Profile
  - Update Profile

- **Bike Management:**
  - View Available Bikes
  - Create, Update, Delete Bikes (Admin Only)

- **Rental Management:**
  - Rent a Bike
  - View Rental History
  - Return a Bike (Admin Only)  

- **Payment Integration:**  
  - AAmarPay integrated  

## Stack

- Programming Language: Typescript
- Web Framework: Express js
- Database And ODM: mongodb and mongoose

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/minhaz1010/Bike-Rental-Service.git
   cd Bike-Rental-Service
2. npm install

## Commands 

- To run
  ``` 
  npm run start:dev

## File structure
```
├── src
│   ├── app
│   │   ├── config
│   │   │   └── index.ts
│   │   ├── errors
│   │   │   ├── appError.ts
│   │   │   ├── handleCastError.ts
│   │   │   ├── handleDuplicateError.ts
│   │   │   ├── handleZodError.ts
│   │   │   ├── jwtError.ts
│   │   │   └── mongooseValidationError.ts
│   │   ├── middleware
│   │   │   ├── authMiddleware.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   ├── module
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.interface.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── bike
│   │   │   │   ├── bike.controller.ts
│   │   │   │   ├── bike.interface.ts
│   │   │   │   ├── bike.model.ts
│   │   │   │   ├── bike.route.ts
│   │   │   │   ├── bike.service.ts
│   │   │   │   └── bike.validation.ts
│   │   │   ├── booking
│   │   │   │   ├── booking.controller.ts
│   │   │   │   ├── booking.interface.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── booking.route.ts
│   │   │   │   ├── booking.service.ts
│   │   │   │   └── booking.validation.ts
│   │   │   └── user
│   │   │       ├── user.controller.ts
│   │   │       ├── user.interface.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.route.ts
│   │   │       ├── user.service.ts
│   │   │       └── user.validation.ts
│   │   ├── route
│   │   │   └── index.ts
│   │   └── utils
│   │       ├── catchAsyncError.ts
│   │       ├── comparePassword.ts
│   │       ├── index.d.ts
│   │       ├── sendResponse.ts
│   │       └── userRole.ts
│   ├── app.ts
│   └── server.ts
├── ER.png
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── readme.md
├── tsconfig.json
└── vercel.json

 


