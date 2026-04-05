"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = parseInt(process.env.PORT ?? '3000');
const HOST = process.env.HOST ?? '0.0.0.0';
async function start() {
    const app = await (0, app_1.buildApp)();
    try {
        await app.listen({ port: PORT, host: HOST });
        console.log(`🐟 Matsyakosh API running on http://${HOST}:${PORT}`);
        console.log(`📖 Health check: http://localhost:${PORT}/health`);
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
start();
