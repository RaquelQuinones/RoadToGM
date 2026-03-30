const express = require('express')
const app = express()

app.use(express.json())

app.post('/test', (req, res) => {
  console.log('Body:', req.body)
  res.json({ ok: true })
})

app.listen(3001, () => console.log('Test server on 3001'))