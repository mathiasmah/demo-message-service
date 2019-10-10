
export class Environment {
    public static getPort(): number {
        return (process.env.PORT as any) || 8000
    }

    public static getStorageAddress(): string {
        return process.env.STORAGE_ADDRESS || "http://localhost:8081"
    }
}