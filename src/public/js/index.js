const socket = io()

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target);
    const product = {}
    formData.forEach((value, key) => {
        product[key] = value
    })

    socket.emit('addProduct', product)
    event.target.reset()
});

document.getElementById('products-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const productId = event.target.parentElement.getAttribute('dataId');
        socket.emit('deleteProduct', productId)
    }
});

socket.on('updateProducts', (products) => {
    const productsList = document.getElementById('products-list')
    productsList.innerHTML = ''
    products.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.className = 'product'
        productDiv.setAttribute('dataId', product.id)
        productDiv.innerHTML = `
            <p>Name: <strong>${product.title}</strong></p>
            <p>Price: ${product.price}</p>
            <p>Description: ${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
            <button class="delete-btn">Delete</button>
        `
        productsList.appendChild(productDiv)
    })
})



