# Back End API project

#### `dev ~ Joey Alvarado`

## Description

This project is a backend application using Node.js, Express, and Handlebars for managing products. The application integrates Websocket using Socket.io for real-time updates. It provides routes for CRUD operations on products and includes real-time updates for product changes. Below is a detailed description of the setup, routes, and usage.

## Table of contents

1. Installation
2. Usage
3. API Endpoints
   - products
4. Websocket
5. Technologies
6. Contact
7. Contributions
8. License

<br>

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jalvaradoz/2ndDeliveryBackEnd70065.git
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
GET /
```

- Delete a product by ID

```bash
DELETE /api/products/:id
```

- Path parameters:

  - 'id': The ID of the product

- POST a new product

```bash
POST /api/products
```

## WebSockets

To handle real-time updates and interactions, Socket.io is used. Here’s how the Websockets are integrated:

- Server Setup: Websockets are initialized in app.js and handle real-time updates when products are added or deleted.

```javascript
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { getProducts, saveProducts } from "./routes/views.router.js";
import { updateProductList } from "./public/js/index.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("New client connected");

  let products = await getProducts();
  socket.emit("updateProducts", products);

  socket.on("updateProducts", (products) => {
    updateProductList(products);
  });

  socket.on("addProduct", async (product) => {
    const newId =
      products.length > 0
        ? String(Number(products[products.length - 1].id) + 1)
        : "1";
    product.id = newId;
    products.push(product);
    await saveProducts(products);
    socketServer.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (productId) => {
    products = products.filter((product) => product.id !== productId);
    await saveProducts(products);
    socketServer.emit("updateProducts", products);
  });
});
```

- Client-side Integration: On the client-side, Socket.io is used to emit and listen for product updates.

```javascript
const socket = io();

// Add a new product
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const product = {};
  formData.forEach((value, key) => {
    product[key] = value;
  });
  socket.emit("addProduct", product);
  productForm.reset();
});

// Delete a product
document.getElementById("productsList").addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteBtn")) {
    const productId = event.target.closest(".product").getAttribute("dataID");
    fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    socket.emit("deleteProduct", productId);
  }
});

export function updateProductList(products) {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.setAttribute("dataID", product.id);
    productDiv.innerHTML = `
            <p>Name: <strong>${product.title}</strong></p>
            <p>Price: ${product.price}</p>
            <p>Description: ${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
            <button class="deleteBtn">Delete</button>
        `;
    productsList.appendChild(productDiv);
  });
}
```

## Technologies

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,js,vscode,postman&theme=dark)](https://skillicons.dev)

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
