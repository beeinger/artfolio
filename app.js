var express = require('express')
    , app = express()
    , routes = require('./controllers/routes')

const port = 3001

app.use(require('./middleware/main'))
app.use('/api/v1', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))