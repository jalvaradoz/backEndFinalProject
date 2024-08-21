const productForm = document.getElementById('productForm')
if (productForm) {
    productForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)

        const product = {}
        formData.forEach((value, key) => {
            product[key] = value
        })

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    console.log(data)
                } else {
                    console.error('Error:', data.error)
                }
            })
            .catch(err => console.error('Error while adding product:', err))

        productForm.reset()
    })
}

const productsList = document.getElementById('productsList')
if (productsList) {
    document.getElementById('productsList').addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteBtn')) {
            const productId = event.target.closest('.product').getAttribute('dataID')
            fetch(`/products/${productId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.error('Error:', error)
                })
        }
    })
}

const cartList = document.getElementById('cartList')

if (cartList) {
    const removeButtons = cartList.querySelectorAll('.removeFromCart')

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cartItem')

            if (cartItem) {
                const productId = cartItem.getAttribute('data-id')

                fetch(`/cart/products/${productId}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error('Error removing product:', data.error)
                        } else {
                            console.log('Product removed:', data.message)
                            cartItem.remove()
                        }
                    })
                    .catch(error => console.error('Error:', error))
            }
        })
    })
}

function updateCartList(cart) {
    if (cartList) {
        cartList.innerHTML = ''
        if (cart.products.length === 0) {
            cartList.innerHTML = '<p>Your cart is empty.</p>'
            document.getElementById('emptyCart').style.display = 'none'
        } else {
            cart.products.forEach(item => {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'cartItem'
                itemDiv.setAttribute('data-id', item.product._id)
                itemDiv.innerHTML = `
                    <p>Name: <strong>${item.product.title}</strong></p>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="removeFromCart">Remove</button>
                `
                cartList.appendChild(itemDiv)
            })
            document.getElementById('emptyCart').style.display = 'block'
        }
    }
}

document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', function (event) {
        const productId = event.target.getAttribute('data-id')
        addToCart(productId)
    })
})

function addToCart(productId, quantity = 1) {
    fetch(`/cart/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

const emptyCart = document.getElementById('emptyCart')
if (emptyCart) {
    emptyCart.addEventListener('click', function () {
        const cartId = '66c2237aa6953ce022e9c17f'
        fetch(`/cart/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error)
            })
    })
}


// Creation of each product and updating in real time 
function updateProductList(products) {
    if (productsList) {
        productsList.innerHTML = ''
        products.forEach(product => {
            const productDiv = document.createElement('div')
            productDiv.className = 'product'
            productDiv.setAttribute('dataID', product._id)
            productDiv.innerHTML = `
                <p>Name: <strong>${product.title}</strong></p>
                <p>Price: $${product.price}</p>
                <p>Description: ${product.description}</p>
                <p>Stock: ${product.stock}</p>
                <p>Category: ${product.category}</p>
                <button class="addToCart" data-id=${product._id}>Add to cart</button>
                <button class="deleteBtn">Delete</button>
            `
            productsList.appendChild(productDiv)
        })
    }
}




