import { HttpStatus } from '@nestjs/common';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
// import EmployeeAuthService from '../src/modules/employee-auth/employee-auth.service';
chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();


describe('Employer Auth API Test', () => {
  const app = 'http://localhost:4000/v1';
  var userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9yYmlzYWRtaW5Ab3JiaXNwYXkubWUiLCJpZCI6MSwiaWR4IjoiQ0ZGQ0VBNTMtQzk5RC1FQjExLTg1QUEtMjgxODc4M0FCODY2IiwiaXNfc3VwZXJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjIwMTM5OTgzLCJleHAiOjE2MjAyMjYzODN9.CeJ0PlgcINRzsJ7R557VTb5dbajPKfK5K6__RpiTLZU";
  var employerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOiI1OTdDQTBCNC1FNDlELUVCMTEtODVBQS0yODE4NzgzQUI4NjYiLCJlbWFpbCI6ImplbmlzaC5iYWpyYWNoYXJ5YUBvcmJpc3BheS5tZSIsImlhdCI6MTYyMDEzOTk3NCwiZXhwIjoxNjIwMjI2Mzc0fQ.REkSzj8gRfysR1rH9t51nEntAeLmk7yAnUGJcfgUusY";
  var employeeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlkeCI6IjIwRDc3QkM4LUU1OUQtRUIxMS04NUFBLTI4MTg3ODNBQjg3MCIsImVtcGxveWVyX2lkIjoiNTk3Q0EwQjQtRTQ5RC1FQjExLTg1QUEtMjgxODc4M0FCODY2IiwiZW1wbG95ZWVfaWQiOiIxMSIsImlhdCI6MTYyMDEzOTU1NSwiZXhwIjoxNjIwMjI1OTU1LCJhdWQiOiJvcmJpcyIsImlzcyI6Im9yYmlzIiwic3ViIjoiMTQifQ.eFIyEXjbjTMraml4Duf_iTCveF_Y7ChURbCLtesFuso";


  //Search employer 
  it('should search employer', (done) => {
    chai.request(app).get('/user-operation/search-employer')
      .query({ query: 'Carter' })
      .set({ Authorization: `Bearer ${employerToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not search employer', (done) => {
    chai.request(app).get('/user-operation/search-employer')
      .query({ query: 'Carter' })
      // .set({ Authorization: `Bearer ${employerToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //get employer 
  it('should get employer', (done) => {
    chai.request(app).get('/user-operation/get-employer')
      .set({ Authorization: `Bearer ${employerToken}` })
      .query({ query: 'Carter' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get employer', (done) => {
    chai.request(app).get('/user-operation/get-employer')
      // .set({ Authorization: `Bearer ${employerToken}` })
      .query({ query: 'Carter' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //get employer by IDX
  it('should get employer by idx', (done) => {
    chai.request(app).get('/user-operation/get-employer/597CA0B4-E49D-EB11-85AA-2818783AB866')
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get employer by idx', (done) => {
    chai.request(app).get('/user-operation/get-employer/XXXXXX')
      .end((err, res) => {
        should.exist(res);
        console.log(res.body);
        expect(res).to.have.status(422);
        done();
      });
  }).timeout(5000);

  // wrong employer
  it('should get wrong employer info', (done) => {
    const data = {
      wrongUser: 'Carter',
    };
    chai.request(app).post('/user-operation/wrong-user-info')
      .set({ Authorization: `Bearer ${employerToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get  wrong employer info', (done) => {
    const data = {
      wrongUser: 'Carter',
    };
    chai.request(app).post('/user-operation/wrong-user-info')
      .send(data)
      .set({ Authorization: `Bearer ${employerToken}` })
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // Contact me for web
  it('should  Contact me for web', (done) => {
    const data = {
      employer_email: 'jenish.bajracharya@orbispay.me',
    };
    chai.request(app).post('/user-operation/contactme')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${employerToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not  Contact me for web', (done) => {
    const data = {
      employer_email: '',
    };
    chai.request(app).post('/user-operation/contactme')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // Register a new employer from mobile
  it('should invite employer', (done) => {
    const data = {
      employer_email: 'jenish.bajracharya@orbispay.me',
    };
    chai.request(app).post('/user-operation/invite-employer')
      .set({ Authorization: `Bearer ${employerToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not invite employer', (done) => {
    const data = {
      employer_email: '',
    };
    chai.request(app).post('/user-operation/invite-employer')
      .set({ Authorization: `Bearer ${employerToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);


  // Notify an employee
  it('should Notify an employee', (done) => {
    const data = {
      employer_email: 'jenish.bajracharya@orbispay.me',
    };
    chai.request(app).post('/user-operation/notify-employee')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Notify an employee', (done) => {
    const data = {
      employer_email: '',
    };
    chai.request(app).post('/user-operation/notify-employee')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
  // <------ data pending -->
  //get all users 
  it('should get all users', (done) => {
    chai.request(app).get('/user-operation/')
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
      });
  }).timeout(5000);

  it('should not get all users', (done) => {
    chai.request(app).get('/user-operation/')
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  ///pending
  it('should get pending user', (done) => {
    chai.request(app).get('/user-operation/pending')
      .set({ Authorization: `Bearer ${employerToken}` })
      // .query({ query: 'Carter' }) //TODO add list of active user
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get pending user', (done) => {
    chai.request(app).get('/user-operation/pending')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      // .query({ query: '' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
  // <------ data pending -->


  //Get single user by idx
  it('should Get single user by idx', (done) => {
    chai.request(app).get('/user-operation/597CA0B4-E49D-EB11-85AA-2818783AB866')
      .set({ Authorization: `Bearer ${userToken}` })
      // .query({ query: 'Carter' }) //TODO add list of active user
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Get single user by idx', (done) => {
    chai.request(app).get('/user-operation/XXXXXXXXX')
      // .query({ query: '' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //Get single user by idx -pending
  it('should Get single user by idx-pending', (done) => {
    chai.request(app).get('/user-operation/pending/597CA0B4-E49D-EB11-85AA-2818783AB866')
      .set({ Authorization: `Bearer ${userToken}` })
      // .query({ query: 'Carter' }) //TODO add list of active user
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
      });
  }).timeout(5000);

  it('should not Get single user by idx-pending', (done) => {
    chai.request(app).get('/user-operation/pending/XXXXXXXXX')
      .set({ Authorization: `Bearer ${userToken}` })
      // .query({ query: '' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(422);
        done();
      });
  }).timeout(5000);
  // -------------Pending data----------------------------
  // Update a new user
  it('should Update a new user', (done) => {
    const data = { user: "carte" }; //TODO add protocols
    chai.request(app).put('/user-operation/597CA0B4-E49D-EB11-85AA-2818783AB866')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${employerToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Update a new user', (done) => {
    const data = { user: "" };
    chai.request(app).put('/user-operation/XXXXXXXX')
      .set({ Authorization: `Bearer ${userToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
  // --------------------------

  //Delete user by idx
  it('should Delete user by idx', (done) => {
    chai.request(app).delete('/user-operation/76348FE4-ACA6-EB11-85AA-2818783AB866')
      .set({ Authorization: `Bearer ${userToken}` })
      // .query({ query: 'Carter' }) //TODO add list of active user
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Delete user by idx', (done) => {
    chai.request(app).delete('/user-operation/XXXXXXXXX')
      // .query({ query: '' })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(422);
        done();
      });
  }).timeout(5000);

  // Create a new user
  it('should Create a new user', (done) => {
    const data = {
      employer_email: 'testuser@orbispay.me' //TODO add user data
      // userRequesting: 'Carter'
    };
    chai.request(app).post('/user-operation/')
      .set({ Authorization: `Bearer ${userToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Create a new user', (done) => {
    const data = {
      employer_email: '',
      // userRequesting: 'Carter'
    };
    chai.request(app).post('/user-operation/')
      .set({ Authorization: `Bearer ${userToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);



  //Verify a pending User
  it('should Verify a pending User', (done) => {
    const data = {
      status: 'APPROVED',
      rejection_reason: 'invalid data' 
    };
    chai.request(app).put('/user-operation/verify/76348FE4-ACA6-EB11-85AA-2818783AB866')
      .set({ Authorization: `Bearer ${userToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Verify a pending User', (done) => {
    const data = {
      status: '',
      rejection_reason: '' 
        };
    chai.request(app).put('/user-operation/verify/XXXXXXXXX')
      .set({ Authorization: `Bearer ${userToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //Block or unblock a user
  it('should Block or unblock a user', (done) => {
    const data = {
      operation: 'DISABLE' //TODO check data
    };
    chai.request(app).put('/user-operation/enable-disable/76348FE4-ACA6-EB11-85AA-2818783AB866')
      .set({ Authorization: `Bearer ${userToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Block or unblock a user', (done) => {
    const data = {
      operation: 'DISABLE'
    };
    chai.request(app).put('/user-operation/enable-disable/XXXXXXXXX')
      .set({ Authorization: `Bearer ${userToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(422);
        done();
      });
  }).timeout(5000);

  //Get wage
  it('should Get wage', (done) => {
    chai.request(app).get('/user-operation/wage')
      .set({ Authorization: `Bearer ${employeeToken}` }) //TODO check which user have this permissions
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not wage', (done) => {
    chai.request(app).get('/user-operation/wage')
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //Get get employee status
  it('should get employee status', (done) => {
    chai.request(app).get('/user-operation/employee-status')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get employee status', (done) => {
    chai.request(app).get('/user-operation/employee-status')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //Get get hours worked
  it('should get hours-worked', (done) => {
    chai.request(app).get('/user-operation/hours-worked')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not get hours-workeds', (done) => {
    chai.request(app).get('/user-operation/hours-worked')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // id employee
  it('should id employee', (done) => {
    const data = {
      employee_id: '597CA0B4-E49D-EB11-85AA-2818783AB866', 
      ssn_no: '551459570'
    };
    chai.request(app).post('/user-operation/id-employee')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not id employee', (done) => {
    const data = {
      employee_id: '597CA0B4-E49D-EB11-85AA-2818783AB866', 
      ssn_no: '551459570'
    };
    chai.request(app).post('/user-operation/id-employee')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // check employee email
  it('should check employee email', (done) => {
    const data = {
      email: 'jenish.bajracharya@orbispay.me', //TODO add user data
    };
    chai.request(app).post('/user-operation/check-email')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not check employee email', (done) => {
    const data = {
      email: ''
    };
    chai.request(app).post('/user-operation/check-email')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        res.should.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //get employee idx
  it('should get employee idx', (done) => {
    chai.request(app).get('/user-operation/employee/20D77BC8-E59D-EB11-85AA-2818783AB869')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should get employee idx', (done) => {
    chai.request(app).get('/user-operation/employee/597CA0B4-E49D-EB11-85AA-2818783AB866')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  //Set fcm for an employee
  it('should Set fcm for an employee', (done) => {
    const data = {
      fcm_key: 'block',
      platform:'Android'
    };
    chai.request(app).put('/user-operation/fcm')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Set fcm for an employee', (done) => {
    const data = {
      fcm_key: 'block',
      platform:'Android'
    };
    chai.request(app).put('/user-operation/fcm')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // SA get employee idx
  it('should Set sa-activate', (done) => {
    const data = {
      employee: 'block' //TODO check data
    };
    chai.request(app).put('/user-operation/sa-activate')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      // .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Set sa-activate', (done) => {
    const data = {
      employee: ''
    };
    chai.request(app).put('/user-operation/sa-activate')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      // .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // Add phone number
  it('should Add phone number', (done) => {
    const data = {
      mobile_number: '4-8488-8848-484' //TODO check data
    };
    chai.request(app).put('/user-operation/add-mobile')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${employerToken}` })
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Add phone number', (done) => {
    const data = {
      mobile_number: ''
    };
    chai.request(app).put('/user-operation/add-mobile')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  // Change phone number
  it('Change phone number', (done) => {
    const data = {
      mobile_number: '4-8488-8848-777' 
    };
    chai.request(app).put('/user-operation/change-mobile')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not Change phone number', (done) => {
    const data = {
      changeNumber: ''
    };
    chai.request(app).put('/user-operation/change-mobile')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);


  // reset user
  it('should reset user', (done) => {
    const data = {
      employee: '4-8488-8848-484' //TODO check data
    };
    chai.request(app).put('/user-operation/reset-user')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .set('content-type', 'application/json')
      // .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);

  it('should not reset user', (done) => {
    const data = {
      employee: ''
    };
    chai.request(app).put('/user-operation/reset-user')
      .set('content-type', 'application/json')
      // .set({ Authorization: `Bearer ${employeeToken}` })
      // .send(data)
      .end((err, res) => {
        should.exist(res);
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
});
