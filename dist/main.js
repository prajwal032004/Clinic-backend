"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./users/entities/user.entity");
async function seedDatabase(app) {
    try {
        const dataSource = app.get(typeorm_1.DataSource);
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const adminExists = await userRepository.findOne({
            where: { username: 'admin' },
        });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = userRepository.create({
                username: 'admin',
                password: hashedPassword,
                fullName: 'System Administrator',
                role: 'admin',
                isActive: true,
            });
            await userRepository.save(admin);
            console.log('✅ Default admin user created: admin / admin123');
        }
        else {
            console.log('ℹ️  Admin user already exists');
        }
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await seedDatabase(app);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map