/* tslint:disable no-namespace */
import 'express'
import { MessageService } from '../messages/MessageService'

export interface RequestServices {
    messageService: MessageService
}

declare global {
    namespace Express {
        interface Request {
            services: RequestServices
        }
    }
}
