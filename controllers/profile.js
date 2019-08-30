const handleGetProfile = (db) => async (req, res) => {
    console.log('heeeeeeeeeeeeeej')
    try {
        const { id } = req.params
        const user = await db.select('*').from('users').where({ id })
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(404).json('User not found')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    handleGetProfile
}