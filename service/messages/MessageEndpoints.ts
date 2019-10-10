import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'

export class MessageEndpoints {
    public getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const messages = await req.services.messageService.getAllMessages();
            res.json(messages);
            next();
        } catch (err) {
            next(err)
        }
    }

    public getMessageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const messageId = req.params.id;

            const message = await req.services.messageService.getMessage(messageId);

            if (message) {
                res.json(message);
            } else {
                res.sendStatus(HttpStatus.NOT_FOUND);
            }
            next();
        } catch (err) {
            next(err)
        }
    }

    public addMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const message = req.body.message;

            const response = await req.services.messageService.addMessage(message);
            res.json(response);
            next();
        } catch (err) {
            next(err)
        }
    }
}