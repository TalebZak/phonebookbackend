const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('request', (request, response) => (
    JSON.stringify(request.body)
))
app.use(morgan((
            ':method :url :status :res[content-length]- :response-time ms :request'
        )
    )
)
const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response)=>{
    const count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})
app.get('/api/persons/:id',(request, response) => {
    const id = parseInt(request.params.id)
    const person = persons.find(person=> person.id === id)
    if(person)
        response.json(person)
    else
        response.status(404).end()
})
app.delete('/api/persons/:id', (request, response) =>{
    const id = parseInt(request.params.id)
    const index = persons.findIndex(person => person.id === id)
    persons.splice(index, 1)
    response.status(200).send(`person with ${id} deleted successfully`)
})
app.post('/api/persons', (request, response) => {
    const id = persons.length+1
    const body = request.body
    const name = body.name
    const number = body.number
    /*For the sake of simplicity we check the name first.
    We can also check both but there is no need for that */
    if(!name)
        response.status(400).json({error: "name is empty"})
    else if(!number)
        response.status(400).json({error:"number is empty"})
    else{
        if(persons.some(person=>person.name === name))
            response.status(400).json({error:"name already exists"})
        else if(persons.some(person=>person.number === number))
            response.status(400).json({error:"number already exists"})
        else{
            const person = {
                "id": id,
                "name": name,
                "number": number
            }
            persons.push(person)
            response.json(person)
        }

    }

})
PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
