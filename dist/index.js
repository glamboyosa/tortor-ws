"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_ws_1 = __importDefault(require("express-ws"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 4000;
const { app: ewsApp } = (0, express_ws_1.default)(app);
ewsApp.ws('/api/capture', (ws, _) => __awaiter(void 0, void 0, void 0, function* () {
    ws.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const { url, device } = JSON.parse(msg);
        console.log(url);
        console.log(device);
        const browser = puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        try {
            const page = yield (yield browser).newPage();
            device === 'Mobile' && (yield page.emulate(puppeteer_1.default.devices['iPhone X']));
            yield page.goto(url.toString(), { timeout: 0 });
            const screenshotBuffer = (yield page.screenshot());
            const screenshot = screenshotBuffer.toString('base64');
            ws.send(JSON.stringify({ img: screenshot, error: null }));
        }
        catch (e) {
            ws.send(JSON.stringify({ img: null, error: e.message }));
        }
    }));
}));
app.listen(port, () => console.log(`tortor-ws is now listening on port ${port} ⚡️`));
//# sourceMappingURL=index.js.map