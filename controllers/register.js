const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;

    db.transaction(trx => {
        if (name === "" || email === "" || password === "") {
            const fields = [];
            if (name === "") {
                fields.push('name')
            } 
            if (email === "") {
                fields.push('email')
            } 
            if (password === "") {
                fields.push('password')
            }
            throw {
                error_type: 'empty_fields',
                fields: fields
            }
        } else if (password === undefined) {
            throw {
                error_type: 'undefined_fields',
                fields: ['password']
            }
        }

        const hash = bcrypt.hashSync(password, 10)

        const insertUser = trx('users').insert({
            name: name,
            email: email,
            joined: new Date()
        }).returning('*');

        insertLogin = trx('login').insert({
            email: email,
            hash: hash
        }).returning('*');

        Promise.all([insertUser, insertLogin])
            .then(values => {
                const user = values[0][0]
                res.json(user)
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err =>  {
        if (err.code === '23505' && err.constraint === 'users_email_key') {
            res.status(422).json('The email is already in use')
        }
        else if (err.code === '23502' || err.error_type === 'undefined_fields') {
            res.status(400).json('Fields "name", "email" and "password" can\'t be undefined')
        }
        else if (err.error_type === 'empty_fields') {
            const startOfSentence = makeNiceJoin(err.fields)
            res.status(400).json(`${startOfSentence} can't be empty`)
        }
        else {
            res.status(400).json(err)
        }
    })
}

const makeNiceJoin = (fields) => {
    const length = fields.length
    let joinedFields;
    if (length > 1) {
        joinedFields = fields.slice(0, length-1).join(', ')
        joinedFields += ` and ${fields[length-1]}`
    } else {
        joinedFields = fields[0]
    }

    joinedFields = joinedFields.charAt(0).toUpperCase() + joinedFields.slice(1)
    return joinedFields;
}

module.exports = { 
    handleRegister
}