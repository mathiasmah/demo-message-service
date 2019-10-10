import * as express from 'express'
import { Express } from 'express'
import { Server } from 'http'
import * as compress from 'compression'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'

import {MessageEndpoints} from './messages/MessageEndpoints'
import { logging } from './middlewares/LoggingMiddleware'
import { addServicesToRequest } from './middlewares/ServiceDependenciesMiddleware'
import { RequestServices } from './types/CustomRequest'

export class ExpressServer {
    private server?: Express
    private httpServer?: Server

    constructor(private messageEndpoints: MessageEndpoints, private requestServices: RequestServices){}

    public async setup(port: number) {
        const server = express()
        this.setupStandardMiddlewares(server)
        this.setupServiceDependencies(server)
        this.configureApiEndpoints(server)

        this.httpServer = this.listen(server, port)
        this.server = server
        return this.server
    }

    public listen(server: Express, port: number) {
        return server.listen(port)
    }

    public kill() {
        if (this.httpServer) this.httpServer.close()
    }

    private setupStandardMiddlewares(server: Express) {
        server.use(bodyParser.json())
        server.use(cookieParser())
        server.use(compress())
        server.use(logging)
    }

    private setupServiceDependencies(server: Express) {
        const servicesMiddleware = addServicesToRequest(this.requestServices)
        server.use(servicesMiddleware)
    }

    private configureApiEndpoints(server: Express) {
        server.get('/api/messages', this.messageEndpoints.getAllMessages)
        server.get('/api/messages/:id', this.messageEndpoints.getMessageById)
        server.post('/api/messages', this.messageEndpoints.addMessage)
    }
}
