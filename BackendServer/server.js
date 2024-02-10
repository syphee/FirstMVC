// Admission Number : P2107967
// Name : Landicho James Evans Arvesu
// Class : DIT/FT/1B/04


const app = require('./controller/app')
const port = 8081
const hostname = 'localhost'

const server = app.listen(port,hostname,function(){
    console.log(`Web app hosted at http://${hostname}:${port}`)
})