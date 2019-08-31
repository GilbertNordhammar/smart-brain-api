const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const db = knex({
    client: 'pg',
    connection: {
        connectString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => { res.send('is is working!') })
app.post('/register', register.handleRegister(db, bcrypt))
app.post('/signin', signin.handleSignIn(db, bcrypt))
app.put('/image', image.handleImage(db))
app.post('/faceRecognition', image.handleFaceRecognition())
app.get('/profile/:id', profile.handleGetProfile(db))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})