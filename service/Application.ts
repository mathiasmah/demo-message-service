import { RestClient } from 'typed-rest-client'

import { ExpressServer } from './ExpressServer'
import { MessageEndpoints } from './messages/MessageEndpoints'
import { MessageService } from './messages/MessageService';
import { Environment } from './utils/Environment';

export class Application {
    public static async createApplication() {
        const messageService = new MessageService();
        const requestServices = { messageService }
        const expressServer = new ExpressServer(new MessageEndpoints(), requestServices)
        const port = Environment.getPort();
        const loadBalancer = new RestClient("message-service", Environment.getLoadBalancer());

        await Application.registerLoadbalancer(loadBalancer, port);
        await expressServer.setup(port)

        Application.handleExit(expressServer, loadBalancer)

        return expressServer
    }

    private static handleExit(express: ExpressServer, loadBalancer: RestClient) {
        process.on('uncaughtException', (err: Error) => {
            console.error('Uncaught exception', err)
            Application.shutdownProperly(1, express, loadBalancer)
        })
        process.on('unhandledRejection', (reason: {} | null | undefined) => {
            console.error('Unhandled Rejection at promise', reason)
            Application.shutdownProperly(2, express, loadBalancer)
        })
        process.on('SIGINT', () => {
            console.info('Caught SIGINT')
            Application.shutdownProperly(128 + 2, express, loadBalancer)
        })
        process.on('SIGTERM', () => {
            console.info('Caught SIGTERM')
            Application.shutdownProperly(128 + 2, express, loadBalancer)
        })
        process.on('exit', () => {
            console.info('Exiting')
        })
    }

    private static shutdownProperly(exitCode: number, express: ExpressServer, loadBalancer: RestClient) {
        Application.unregisterLoadbalancer(loadBalancer, Environment.getPort())
            .then(() => express.kill())
            .then(() => {
                console.info('Shutdown complete')
                process.exit(exitCode)
            })
            .catch(err => {
                console.error('Error during shutdown', err)
                process.exit(1)
            })
    }

    private static async registerLoadbalancer(loadBalancer: RestClient, port: number) {
        try {
            console.log("Register with loadbalancer");
            const response = await loadBalancer.get('/register/' + port);
            console.log("Responsecode :" +response.statusCode+" Result: "+response.result)
        } catch (err) {
            console.error("Loadbalancer not available, coud not register. Error: " + err);
        }
    }

    private static async unregisterLoadbalancer(loadBalancer: RestClient, port: number) {
        try {
            console.log("Unregister from loadbalancer");
            await loadBalancer.del('/unregister/' + port);
        } catch (err) {
            console.error("Loadbalancer not available, coud not unregister. Error: " + err);
        }
    }
}
