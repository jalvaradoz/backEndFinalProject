const socket = io()

const productForm = document.getElementById('productForm')

productForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)

    const product = {}
    formData.forEach((value, key) => {
        product[key] = value
    })

    socket.emit('addProduct', product)
})

document.getElementById('productsList').addEventListener('click', (event) => {
    if (event.target.id === 'deleteBtn') {
        const productId = event.target.getAttribute('dataID')
        socket.emit('deleteProduct', productId)
    }
})

socket.on('updateProducts', (products) => {
    updateProductList(products)
})

function updateProductList(products) {
    const productsList = document.getElementById('productsList')
    productsList.innerHTML = ''
    products.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.className = 'product'
        productDiv.setAttribute('dataID', product.id)
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




