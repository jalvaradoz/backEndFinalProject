const socket = io()

let user

Swal.fire({
    title: 'Identify',
    input: 'text',
    text: 'Name:',
    inputValidator: (value) => {
        return !value && 'Please enter a user name'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    user = result.value.trim()

    const input = document.getElementById('messageInput')
    const buttonSend = document.getElementById('send')

    const submitNewMessage = () => {
        let message = input.value.trim()
        if (message.length > 0) {
            socket.emit('message', { user: user, message: message })
            input.value = ''
        }
    }

    buttonSend.addEventListener('click', () => {
        submitNewMessage()
    })

    input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
            submitNewMessage()
        }
    })

    socket.on('messages', data => {
        const log = document.getElementById('displayMessages')
        let messages = data.map(msg => `<p>${msg.user}: ${msg.message}</p>`).join('')
        log.innerHTML = messages
    })
})


