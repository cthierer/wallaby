
const app = require('./lib/server').default

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`started, listening on port ${port}`)
})
