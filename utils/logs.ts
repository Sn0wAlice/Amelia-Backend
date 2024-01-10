export const logs = {
    debug: (message: string) => {
        console.log(`[DEBUG] ${message}`);
    },
    info: (message: string) => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message: string) => {
        console.log(`[WARN] ${message}`);
    },
    error: (message: string) => {
        console.log(`[ERROR] ${message}`);
    }
}