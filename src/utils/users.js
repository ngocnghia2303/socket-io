const users = []

//add, remove, get, getUserInRoom

//parameter: id, username, room
const addUser = ({ id, username, room }) => {
    //clear the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { users }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

//Testing scripts or prepare user data
addUser({
    id: 22,
    username: 'Kim Anh Tran',
    room: 'linda http'
})

addUser({
    id: 42,
    username: 'Do Ngoc Nghia',
    room: 'linda http'
})

addUser({
    id: 32,
    username: 'Do Ngoc Tam',
    room: 'Zouky Tran'
})

const user = getUser(421)
console.log(user)

const listUsers = getUsersInRoom('Linda http')
console.log(listUsers)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}