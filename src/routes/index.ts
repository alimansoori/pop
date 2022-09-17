import * as express from 'express'
import IndexController from '../controllers/indexController'

/* GET home page. */
export const register = (app: express.Application) => {
    app.get('/', IndexController.Index)
}
