import { Message } from './Message';
import { Environment } from '../utils/Environment';
import { MongoClient, Collection } from 'mongodb';

export class MessageService {

    private client: MongoClient;
    private db:Collection<Message> | undefined;

    public constructor() {
        this.client = new MongoClient(Environment.getMongoAddress(), { useUnifiedTopology: true, useNewUrlParser: true, authSource: "admin"} );
        this.client.connect()
        .then( () => {
            console.log("Successfully connect to database");
            this.db = this.client.db("messages").collection<Message>("messages");
        })
        .catch( (err) => {
            console.error("Error while creating connection Error: " + err)
        })
    }

    

    public getAllMessages = async (): Promise<Message[]> => {
        if(this.db){
            try{
             return await this.db.find({}).toArray();
            }catch(err) {
             console.error("Error while trying to get all messages, Error: " + err);
            }
        } else {
            console.error("Error while trying to get all messages, Error: No connection established")
        }
        return [];
    }

    public getMessage = async (id: string): Promise<Message | null> => {
        if(this.db){
            try{
             return await this.db.findOne({_id : id});
            }catch(err) {
             console.error("Error while trying to get message with " + id + ", Error: " + err);
            }
        } else {
            console.error("Error while trying to get message with " + id + ", Error: No connection established")
        }
        return null;
    }

    public addMessage = async (message: string): Promise<Message | null> => {
        if(this.db){
            try{
            let result = await this.db.insertOne({message: message, timestamp: Date.now()});
            return result.ops[0];
            }catch(err) {
             console.error("Error why creating new message, Error: " + err);
            }
        } else {
            console.error("Error why creating new message, Error: No connection established")
        }
        return null;

    }
}