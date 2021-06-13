"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const index_1 = require("./config/index");
const nest_winston_1 = require("nest-winston");
const compression = require("compression");
const helmet = require("helmet");
const common_1 = require("@nestjs/common");
const requestSanitizer_interceptor_1 = require("./common/interceptor/requestSanitizer.interceptor");
const timeout_interceptor_1 = require("./common/interceptor/timeout.interceptor");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('etag', 'strong');
    app.set('trust proxy', true);
    app
        .use(compression())
        .use(helmet())
        .useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        validationError: { target: false },
    }))
        .useGlobalInterceptors(new requestSanitizer_interceptor_1.RequestSanitizerInterceptor())
        .useGlobalInterceptors(new timeout_interceptor_1.TimeoutInterceptor())
        .setGlobalPrefix('v1')
        .enableCors();
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Employee Api')
        .setBasePath('v1')
        .setDescription('The Employee API description built using swagger OpenApi. You can find out more about Swagger at http://swagger.io')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http', scheme: 'bearer', bearerFormat: 'Token'
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(index_1.default.port);
    console.info(`Operation server running on 🚀 http://localhost:${index_1.default.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map