import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'
import router from './router'

const app = new Koa()

app.use(serve(path.join(__dirname, '../dist')))
app.use(views(path.join(__dirname, '/templates'), { map: { hbs: 'handlebars' }, extension: 'hbs' }))
app.use(bodyParser())
app.use(cors())
app.use(router.routes(), router.allowedMethods())

export default app
