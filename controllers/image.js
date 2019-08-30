const Clarifai = require('clarifai')

const clarifaiApp = new Clarifai.App({ apiKey: 'bddfe371033545198cd6092c2ea712cd' })

const handleFaceRecognition = () => async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const data = await clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
        console.log(imageUrl, data)
        res.json(data)
    } catch (error) {
        res.status(400).json('Unable to work with face detection API')
    }
}

const handleImage = (db) => async (req, res) => {
    try {
        const { id } = req.body
        const entries = await db('users').select('*').where({ id }).increment('entries', 1).returning('entries')
        if (entries.length) {
            res.json(entries[0])
        } else {
            throw Error
        }
    } catch (error) {
        res.status(400).json('Error getting user')
    }
}

module.exports = {
    handleImage,
    handleFaceRecognition
}