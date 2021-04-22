var socket = io()

//setup selector elements
const $messageForm = document.querySelector('#message-form')
const $formInput = $messageForm.querySelector('Input')
const $formButton = $messageForm.querySelector('Button')
const $sendGeo = document.querySelector('#send-geo')
const $messages = document.querySelector('#messages')

//template
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $formButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $formButton.removeAttribute('disabled')
        //setup formInput have empty value after send message
        $formInput.value = ''
        $formInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('==> The Message was delivered!')
    })
})

$sendGeo.addEventListener('click', () => {
    if (!navigator.geolocation.getCurrentPosition) {
        console.log('Can not get current position!')
    }
    
    $sendGeo.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
            'long': position.coords.longitude,
            'lat': position.coords.latitude
        }
        // const location = `Toa do cua tao ne Kim Anh => long: ${coords.long}, lat: ${coords.lat}`
        const myaddress = `https://www.google.com/maps?q=${coords.lat},${coords.long}`
        socket.emit('sendLocation', myaddress, () => {
            $sendGeo.removeAttribute('disabled')
            return console.log('Location shared!')
        })

    })
})