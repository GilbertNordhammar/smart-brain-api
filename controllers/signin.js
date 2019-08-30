const handleSignIn = (db, bcrypt) => async (req, res) => {
    const { email, password } = req.body
    try {
        const login = await db('login').select('hash').where( { email } )

        const validLogin = await bcrypt.compare(password, login[0].hash);
        if (validLogin) {
            const user = await db('users').select('*').where({ email })
            if (user.length) {
                res.json(user[0])
            } else {
                throw Error('Error logging in')
            }
        } else {
            throw Error('Incorrect log in information')
        }
    } catch (error) {
        res.status(400).json('Incorrect log in information')
    }
}

module.exports = {
    handleSignIn
}