
export class Environment {
    public static getPort(): number {
        return (process.env.PORT as any) || 7000
    }

    public static getStorageAddress(): string {
        return process.env.STORAGE_ADDRESS || "http://localhost:9000"
    }

    public static getLoadBalancer(): string {
        return process.env.LOAD_BALANCER || "http://localhost:8081"

    }
}