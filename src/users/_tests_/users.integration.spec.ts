import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { UserRole, UserStatus } from '../constants/user.enum';

describe('Users Module (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Creation', () => {
    it('/users (POST) should create a new user', async () => {
        const uniqueEmail = `integration-${Date.now()}@test.com`;
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Integration Test User',
          email: uniqueEmail,
          password: 'password123',
          phone: '1234567890',
          role: UserRole.CUSTOMER, // Add this
          status: UserStatus.ACTIVE // Add this
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(uniqueEmail);
    });
  });

  describe('User Retrieval', () => {
    it('/users (GET) should return paginated users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ page: 1, size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });
});