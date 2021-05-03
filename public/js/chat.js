var socket = io()

//setup selector elements
const $messageForm = document.querySelector('#message-form')
const $formInput = $messageForm.querySelector('Input')
const $formButton = $messageForm.querySelector('Button')
const $sendGeo = document.querySelector('#send-geo')
const $messages = document.querySelector('#messages')

//links.mead.io/chatassets

//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { room, username } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $newMessage.offsetHeight

    //Height of messageContainer
    const containerHeight = $newMessage.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h: mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h: mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})