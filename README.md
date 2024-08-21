# Back End API project

#### `dev ~ Joey Alvarado`

## Description

This project is a backend application developed using Node.js, Express, and Handlebars, designed for managing products and shopping carts. The application provides RESTful API endpoints for CRUD operations on products and carts, with features such as pagination, sorting, and filtering. Additionally, it supports adding products to carts and updating cart contents.

## Table of contents

1. Installation
2. Usage
3. API Endpoints
   - products
   - Carts
4. Technologies
5. Contact
6. Contributions
7. License

<br>

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jalvaradoz/backEndFinalProject.git
```

2. Navigate to the project directory:

```bash
cd backend-project
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server

```bash
npm start
```

2. The server will be running on port 8080. You can change the port in the app.js file if needed.

## API Endpoints

### Products

- Get all products

```bash
GET /api/products
```

- Query parameters:

  - limit (optional): Number of products per page (default: 10).
  - page (optional): Page number to retrieve (default: 1).
  - sort (optional): Sort by price, either asc or desc.
  - query (optional): Filter by category or stock availability.

  -Example response format:

```json
{
    "status": "success",
    "payload": [...],
    "totalPages": 5,
    "prevPage": 1,
    "nextPage": 3,
    "page": 2,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevLink": "/?page=1&limit=10",
    "nextLink": "/?page=3&limit=10"
}
```

- Delete a product by ID

```bash
DELETE /products/:id
```

- Path parameters:

  - 'id': The ID of the product

- POST a new product

```bash
POST /products
```

- Update an existing product by ID

```bash
PUT /products/:id
```

- Carts

* Update an existing product by ID

```bash
GET /cart/:cid
```

- Add products to a cart or update the cart with a new product array

```bash
PUT /cart/:cid
```

- Update the quantity of a specific product in the cart

```bash
PUT /cart/products/:pid
```

- Remove a product from the cart by ID

```bash
DELETE /cart/products/:pid
```

- Clear all products from a cart

```bash
DELETE /cart/:cid
```

## Technologies

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,js,vscode,postman,mongo&theme=dark)](https://skillicons.dev)

## Contact

<p align="center">
  <a href="https://github.com/jalvaradoz">
    <img src="https://skillicons.dev/icons?i=github" />
  </a>
  <a href="https://www.linkedin.com/in/joey-alvarado-741a36180/">
    <img src="https://skillicons.dev/icons?i=linkedin" />
  </a>
  <a href="https://joeyalvarado.netlify.app/">
    <img src="https://joeyalvarado.netlify.app/Assets/Img/joeyContact.png" width='50px'/>
  </a>
</p>

## Contributions

If you want to contribute to this project, please fork the repository and create a pull request.

## License

#### This project is licensed under the MIT License.
