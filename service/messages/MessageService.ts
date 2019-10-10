import {RestClient} from 'typed-rest-client'

import { Message } from './Message';
import { Environment } from '../utils/Environment';

export class MessageService {
    private client: RestClient = new RestClient("message-service", Environment.getStorageAddress());
    
    public getAllMessages = async (): Promise<Message[]> => {
        let res = await this.client.get<Message[]>('/store/message');
        return res.result || []
    }

    public getMessage = async (id:string): Promise<Message | undefined> => {
        let res = await this.client.get<Message>('/store/message/'+id);
        return res.result || undefined;
    }

    public addMessage = async (message:string): Promise<Message | undefined> => {
        let data = {
            message: message,
        }
        
        let res = await this.client.create<Message>('/store/message',data);
        return res.result || undefined;
        
    }
}