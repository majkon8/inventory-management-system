# Inventory Management System API

CQRS API with separated write and read Mongo databases and Event Driven communication

## Prerequisites

-   Node.js - ^20.0.0
-   NPM - ^10.0.0
-   Docker - ^24.0.0 (optional)
-   Docker compose - ^2.20.0 (optional)

## Installation

Follow steps listed below for installation.

### Clone repository

`git clone git@github.com:majkon8/inventory-management-system-api.git`

### Install backend

-   Go to backend directory: `cd backend/`
-   Install NPM dependiences: `npm i`
-   Copy `.env` file from `.env.example` by `cp .env.example .env` and edit `.env` file with your variables (you can use default variables without changing anything)

#### If you are using Docker please follow steps below

-   Run `npm run dc-up` - this command will build docker-compose.

## Run

### Backend

You can run backend with `npm run dev`.

!IMPORTANT 
Queues are necessary for read and write databases to sync so you also have to run `npm run queues`.

## Tests

### Backend

-   Go to backend directory: `cd backend/`
-   Copy `.env.test` file from `.env.example` by `cp .env.example .env.test` and edit `.env.test` file with your variables (you can use default variables without changing anything)
-   You can run tests with `npm run test`.

## Documentation

GET /api/products - Get all products

POST /api/products - Create product
{
    "name": string,
    "description": string,
    "price": number,
    "stock": number
}

POST /api/products/<productId>/restock - Increase product stock
{
    "quantity": number
}

POST /api/products/<productId>/sell - Decrease product stock
{
    "quantity": number
}

POST /api/orders - Create order
{
    "customerId": string,
    "products": Array<{
        "id": string,
        "quantity": number
    }>
}