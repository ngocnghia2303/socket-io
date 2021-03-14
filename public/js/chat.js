var socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('==> The Message was delivered!')
    })
})

document.querySelector('#send-geo').addEventListener('click', () => {
    if (!navigator.geolocation.getCurrentPosition) {
        console.log('Can not get current position!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
            'long': position.coords.longitude,
            'lat': position.coords.latitude
        }
        // const location = `Toa do cua tao ne Kim Anh => long: ${coords.long}, lat: ${coords.lat}`
        const myaddress = `https://www.google.com/maps?q=${coords.lat},${coords.long}`
        socket.emit('sendLocation', myaddress, () => {
            return console.log('Location shared!')
        })

    })
})