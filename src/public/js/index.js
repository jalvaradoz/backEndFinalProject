const socket = io()

//this adds the new product
const productForm = document.getElementById('productForm')

productForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)

    const product = {}
    formData.forEach((value, key) => {
        product[key] = value
    })

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
        .then(res => res.json())
        .then(data => {
            if (data.result === 'success') {
                console.log('Product added successfully')
            } else {
                console.error('Error:', data.error)
            }
        })
        .catch(err => console.error('Error while adding product:', err))

    productForm.reset()
})

//this one deletes product based on the product ID 

document.getElementById('productsList').addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const productId = event.target.closest('.product').getAttribute('dataID')
        fetch(`/api/products/${productId}`, {
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

// add to cart






// this one is the one that handles the updating in real time 

socket.on('updateProducts', (products) => {
    updateProductList(products)
})

function updateProductList(products) {
    const productsList = document.getElementById('productsList')
    productsList.innerHTML = ''
    products.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.className = 'product'
        productDiv.setAttribute('dataID', product._id)
        productDiv.innerHTML = `
            <p>Name: <strong>${product.title}</strong></p>
            <p>Price: ${product.price}</p>
            <p>Description: ${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
            <button class="deleteBtn">Delete</button>
        `
        productsList.appendChild(productDiv)
    })
}




