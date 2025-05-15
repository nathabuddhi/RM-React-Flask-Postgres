
# React + Flask + PostgreSQL Tasks

## 1. Project Initialization
**Prompt**:  
I am a Software Engineer currently working on an web-based e-commerce project. The technology stack for this project is Vite React for the Front-end, Flask for the Backend, and PostgreSQL as the database. Provide the project initialization steps according to the chosen technology stack.

## 2. Task 1: User Authentication
**Prompt**:  
I am currently working on the Authentication part of my project. Write code to make a login and register functionality in both front-end and back-end so that this functionality is fully implemented.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- PostgreSQL table: `MsUser`
  - `Email VARCHAR(100) PRIMARY KEY`
  - `Password VARCHAR(255) NOT NULL`
  - `Role VARCHAR(15) NOT NULL` ('Customer' or 'Seller')
- Two pages: Register and Login
- Role-based redirect and validation
- Error handling for login/register

## 3. Task 2: Product Management
**Prompt**:  
I am currently working on the Product Management part of my project. This feature will allow sellers to manage their products that they sell.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- PostgreSQL table: `MsProduct`
  - `ProductId UUID PRIMARY KEY`
  - `ProductName VARCHAR(50)`
  - `ProductDescription TEXT`
  - `ProductImages`
  - `ProductPrice DECIMAL(10, 2)`
  - `ProductStock INT`
  - `ProductOwner` (FK to `MsUser.Email`)
- Single seller page: View, Edit, Delete, Create
- Success/error message display

## 4. Task 3: Product Search
**Prompt**:  
I am currently working on the Product Search part of my project.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- Server-side search (no front-end filtering)
- Display products with full info (truncate long description)
- Navigate to product detail page
- Error message on no matches

## 5. Task 4: Shopping Cart System
**Prompt**:  
I am currently working on the Shopping Cart part of my project.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- PostgreSQL table: `Cart`
  - `ProductId CHAR(36)`
  - `Customer VARCHAR(255)`
  - `Quantity INT DEFAULT 1`
  - Composite Primary Key: `ProductId`, `Customer`
- View cart, modify quantity, remove items
- Checkout all items
- Show error/success messages

## 6. Task 5: Checkout System
**Prompt**:  
I am currently working on the Checkout part of my project.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- PostgreSQL table: `Orders`
  - `OrderId CHAR(36) UUID`
  - `ProductId CHAR(36) FK`
  - `Quantity INT`
  - `Customer VARCHAR(255) FK`
  - `Status VARCHAR(15) DEFAULT 'Pending'`
  - `Timestamp TIMESTAMP`
- Input: payment method, shipping address
- Error message on failure

## 7. Task 6: Order Management
**Prompt**:  
With the Checkout System implemented, make one final page for both sellers and customers to be able to view orders.

**Requirements**:
- React (Typescript + Tailwind)
- Flask
- Seller tabs: Pending, Accepted, Shipped/Completed
- Customer list: sorted by timestamp
- Statuses: Pending, Accepted, Shipped, Completed
- Customers can mark as â€œreceivedâ€
