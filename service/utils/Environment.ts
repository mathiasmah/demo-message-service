
export class Environment {
    public static getPort(): number {
        return (process.env.PORT as any) || 7000
    }

    public static getMongoAddress(): string {
        return "mongodb://" + Environment.getMongoUser() + ":" + Environment.getMongoPassword() + "@" + Environment.getMongoURL() + "/messages"
    }

    private static getMongoURL(): string {
        return process.env.STORAGE_ADDRESS || "localhost:27017"
    }

    private static getMongoUser(): string {
        return process.env.STORAGE_USER || "root"
    }

    private static getMongoPassword(): string {
        return process.env.STORAGE_PASS || "password"
    }

    public static getLoadBalancer(): string {
        return process.env.LOAD_BALANCER || "http://localhost:8081"
    }
}