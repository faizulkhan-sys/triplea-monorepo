import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

describe('Deduction (e2e)', () => {
  const app = 'http://localhost:8010/v1';

  const admin_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9yYmlzYWRtaW5Ab3JiaXNwYXkubWUiLCJpZCI6MSwiaWR4IjoiQzE5OEFGQzYtOTY4Qy1FQjExLTg1QUEtMDAwM0ZGRkZCRjI2IiwiaXNfc3VwZXJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjE3MTAxMjc2LCJleHAiOjE5MTk2OTMyNzZ9._za9Ew9KfWWVBIpsHUeQgpnvczwISrfPd1IEIzOejLg';

  it('should create global policy', async () => {
    const data = {
      name: 'Test Policy 1',
      min_value: 10,
      max_value: 70,
      is_default_policy: false,
    };

    return request(app)
      .post('/sa-global-policy/create')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + admin_token)
      .send(data)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.message).toEqual('Request awaiting approval');
      })
      .expect(HttpStatus.CREATED);
  });

  it('should throw validation error when creating global policy', async () => {
    const data = {
      name: '',
      min_value: 10,
      max_value: 70,
      is_default_policy: false,
    };

    return request(app)
      .post('/sa-global-policy/create')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + admin_token)
      .send(data)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should update global policy', async () => {
    const data = {
      name: 'Test Policy 1',
      min_value: 10,
      max_value: 70,
      is_default_policy: false,
    };

    return request(app)
      .put('/sa-global-policy/update/')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + admin_token)
      .send(data)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.message).toEqual('Request awaiting approval');
      })
      .expect(HttpStatus.OK);
  });

  it('should throw validation error on bad data on update global policy', async () => {
    const data = {
      name: 'Test Policy 1',
      min_value: '10',
      max_value: 70,
      is_default_policy: false,
    };

    return request(app)
      .put('/sa-global-policy')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + admin_token)
      .send(data)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
