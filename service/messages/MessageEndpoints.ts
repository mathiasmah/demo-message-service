import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'

export class MessageEndpoints {
    public getAllMessages = async (req: Request, res: Response, next: NextFunction ) => {
        try{
            res.json(req.services.messageService.getAllMessages());
            next();
        } catch (err) {
            next(err)
        }
    }

    public getMessageById = async (req: Request, res: Response, next: NextFunction ) => {
        try{
            const messageId = req.params.id;

            req.services.messageService.getMessage(messageId)
                .then(message => {
                    if(message){
                        res.json(message);
                    } else {
                        res.sendStatus(HttpStatus.NOT_FOUND);
                    }
                    next();
                })
        } catch (err) {
            next(err)
        }
    }

    public addMessage = async (req: Request, res: Response, next: NextFunction ) => {
        try{
            const message = req.body.message;

            req.services.messageService.addMessage(message).
                then( m =>{
                    res.json(m)
                    next();
                })
        } catch (err) {
            next(err)
        }
    }
}