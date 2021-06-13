import { HttpStatus } from '@nestjs/common';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

// import { expose } from 'threads/worker';
import * as CryptoJS from 'crypto-js';

const enc_key = 'AEON5c56!9E4e#MR';




// import EmployeeAuthService from '../src/modules/employee-auth/employee-auth.service';
chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();


describe('Employer Auth API Test', () => {
    const app = 'http://localhost:4000/v1';
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOiI1OTdDQTBCNC1FNDlELUVCMTEtODVBQS0yODE4NzgzQUI4NjYiLCJlbWFpbCI6ImplbmlzaC5iYWpyYWNoYXJ5YUBvcmJpc3BheS5tZSIsImlhdCI6MTYxOTcxOTE5NiwiZXhwIjoxNjE5ODA1NTk2fQ.GyGca5vtWi4Y6USst9Z2R3YZUQNLDVlSwQ35crcmQhg"
    var idx = '';

    // Get Captcha
    it('should get captcha', (done) => {
        chai.request(app).get('/employer-auth/captcha')
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);
    // Forget password cases
    it('should forgot the password', (done) => {
        const data = { employer_email: "jenish.bajracharya@orbispay.me" };
        chai.request(app).post('/employer-auth/forgot-password')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.have.property('message', 'Please check your email for code');
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not forgot the password', (done) => {
        const data = { employer_email: "XX-jenish.bajracharya@orbispay.me" };
        chai.request(app).post('/employer-auth/forgot-password')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.have.property('message', 'Employer with email address not found');
                expect(res).to.have.status(404);
                done();
            });
    }).timeout(20000);

    // Login cases -employer
    it('should login the employer', (done) => {
        let captchaDummy = 'hpMc6D';
        const data = {
            captcha: captchaDummy,
            captcha_token: CryptoJS.AES.encrypt(captchaDummy, enc_key).toString(),
            email: 'jenish.bajracharya@orbispay.me',
            password: 'Trafal12345@'
        };
        console.log('Dynamic Login DTO -> ' + JSON.stringify(data));
        chai.request(app).post('/employer-auth/employer/login')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                console.log(res.body);
                expect(res.body).to.have.property('message', 'Successfully signed in');
                expect(res).to.have.status(201);
                console.log(res.body.data.payload.response.idx);
                token = res.body.data.payload.access_token,
                    idx = res.body.data.payload.response.idx
                done();
            });
    }).timeout(20000);

    it('should not login the employer', (done) => {
        const data = {
            captcha: 'ATSTzR',
            captcha_token: 'U2FsdGVkX1+StVq6mpN34BG7ZtMcJqGKa1ufmMlaJbk=',
            email: 'jenish.bajracharya@orbispay.me',
            password: '',
        };
        chai.request(app).post('/employer-auth/employer/login')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.not.have.property('message', 'Successfully signed in');
                expect(res).to.have.status(400);
            });
    }).timeout(20000);


    // // Login cases -user 
    it('should  login the user (type Default-Employer)', (done) => {
        const data = {
            captcha: 'ayNMIX',
            captcha_token: 'U2FsdGVkX18OJDmKEvr+g0M1X2nc+XUjeE60OkH9tR8=',
            email: 'jenish.bajracharya@orbispay.me',
            password: 'Trafal123456@'
        };
        chai.request(app).post('/employer-auth/user/login')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.have.property('message', 'Cannot login employer to admin dashboard');
                expect(res).to.have.status(401);
            });
    }).timeout(20000);

    it('should not login the user', (done) => {
        const data = {
    captcha: 'ATSTzR',
    captcha_token: 'U2FsdGVkX1+StVq6mpN34BG7ZtMcJqGKa1ufmMlaJbk=',
    email: 'jenish.bajracharya@orbispay.me',
    password: ''
        };
        chai.request(app).post('/employer-auth/user/login')
            .set('content-type', 'application/json')
            .send(data)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.not.have.property('message', 'Successfully signed in');
                expect(res).to.have.status(401);
            }).catch(function (err) {
                throw err;
            });
    }).timeout(20000);

    // // checking all the permissions and routes a user is allowed to use
    it('should allow to checking all the permissions and routes a user is allowed to use', (done) => {
        chai.request(app).post('/employer-auth/')
            .set('content-type', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not allow to checking all the permissions and routes a user is allowed to use', (done) => {
        chai.request(app).post('/employer-auth/')
            .set('content-type', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);



    // // Check Link - token in an email

    it('should valid token in an email', (done) => {

        chai.request(app).get('/employer-auth/check-link/' + token)
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.have.property('message', 'Token is correct');
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not valid token in an email', (done) => {

        chai.request(app).get('/employer-auth/check-link/XXXXXXXX')
            .end((err, res) => {
                should.exist(res);
                res.should.be.an('object');
                expect(res.body).to.have.property('message', 'Token is invalid');
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);


    // Get Routes
    it('should routes', (done) => {
        chai.request(app).get('/employer-auth/mapped-routes')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not routes', (done) => {
        chai.request(app).get('/employer-auth/mapped-routes')
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);

    //block-unblock user
    it('should block-unblock user', (done) => {
        const data = {
            blockUnblock: { operation: "unblock" },
        };
        // chai.request(app).put('/employer-auth/block-unblock/1/597CA0B4-E49D-EB11-85AA-2818783AB866')
        chai.request(app).put('/employer-auth/block-unblock/1/' + idx)
            .set('content-type', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not block-unblock user', (done) => {
        const data = {
            blockUnblock: { operation: "block" },
        };
        chai.request(app).put('/employer-auth/block-unblock/1/' + idx)
            .set('content-type', 'application/json')
            // .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);

    //Get all permissions
    it('should get all permissions', (done) => {

        chai.request(app).get('/employer-auth/all-permission')
            .set({ Authorization: `Bearer ${token}` })
            .query({ permission_type: 'all' })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not get all permissions', (done) => {

        chai.request(app).get('/employer-auth/all-permission')
            .query({ permission_type: 'all' })
            .end((err, res) => {
                should.exist(res);
                // should.be.not.empty;
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    //Get permissions by idx
    it('should get permissions by idx', (done) => {

        chai.request(app).get('/employer-auth/' + idx)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not get permissions by idx', (done) => {

        chai.request(app).get('/employer-auth/' + idx + 'z')
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(422);
                done();
            });
    }).timeout(20000);

    // Get settings
    it('should return settings', (done) => {

        chai.request(app).get('/employer-auth/get-settings')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not settings', (done) => {

        chai.request(app).get('/employer-auth/get-settings')

            .set({ Authorization: '' })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);

    // // Get all available protocol
    it('should Get all available protocol', (done) => {

        chai.request(app).get('/employer-auth/')
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    // update a protocol
    it('should update a protocol', (done) => {
        const data = { protocolUpdate: "" }; //TODO add protocols
        chai.request(app).put('/employer-auth/' + idx)
            .set('content-type', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not update a protocol', (done) => {
        const data = { protocolUpdate: "" };
        chai.request(app).put('/employer-auth/' + idx + 'z')
            .set('content-type', 'application/json')
            // .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);

    // update a settings
    it('should update a settings', (done) => {
        const data = { AddUpdateSettingDto: "" }; //TODO add AddUpdateSettingDto
        chai.request(app).put('/employer-auth/update-settings')
            .set('content-type', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(20000);

    it('should not update a settings', (done) => {
        const data = { AddUpdateSettingDto: "" };
        chai.request(app).put('/employer-auth/update-settings')
            .set('content-type', 'application/json')
            // .set({ Authorization: `Bearer ${token}` })
            .send(data)
            .end((err, res) => {
                should.exist(res);
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(20000);

    // //  Set Password cases
    // it('should set password for employer', (done) => {
    //     const data = {
    //         password: 'Trafal12345@',
    //         otp_code: '449421' //@TODO add otp code
    //     };
    //     chai.request(app).post('/employer-auth/set-password')
    //         .set('content-type', 'application/json')
    //         .send(data)
    //         .end((err, res) => {
    //             should.exist(res);
    //             res.should.be.an('object');
    //             expect(res.body).to.have.property('message', 'Password updated successfully');
    //             expect(res).to.have.status(201);
    // done();
    //         });
    // }).timeout(20000);

//     // it('should not set password for employer', (done) => {
//     //     const data = {
//     //         password: '',
//     //         otp_code: '' //@TODO add otp code
//     //     };
//     //     chai.request(app).post('/employer-auth/set-password')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.not.have.property('message', 'Password updated successfully');
//     //             expect(res).to.have.status(401);
//     // done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // //   Reset Password cases
//     // it('should reset password for employer', (done) => {
//     //     //.timeout(20000);
//     //     const data = {
//     //         password: '1234',
//     //         otp_code: '' //@TODO add otp code
//     //     };
//     //     chai.request(app).put('/employer-auth/reset-password')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.not.have.property('message', 'Password updated successfully');
//     //             expect(res).to.have.status(401);
//     // done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // it('should not reset password for employer', (done) => {
//     //     const data = {
//     //         password: '',
//     //         otp_code: '' //@TODO add otp code
//     //     };
//     //     chai.request(app).put('/employer-auth/reset-password')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.not.have.property('message', 'Password updated successfully');
//     //             expect(res).to.have.status(401);
//     // done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // password changed cases -pending
//     // it('should change current password for employer', (done) => {
//     //     const data = {
//     //         password: 'Trafal12345@',
//     //         new_password: 'Trafal12345@'
//     //     };
//     //     chai.request(app).post('/employer-auth/change-password')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.have.property('message', 'Password Updated');
//     //             expect(res).to.have.status(201);
//     //             done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // it('should not change current password for employer', (done) => {
//     //     const data = {
//     //         password: '1234',
//     //         new_password: '1234'
//     //     };
//     //     chai.request(app).post('/employer-auth/change-password')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.not.have.property('message', 'Current password and new password cannot be same');
//     //             expect(res).to.have.status(401);
//     //             done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // //  Reset Mpin cases
//     // it('should reset mpin for employer', (done) => {
//     //     const data = {
//     //         mpin: 1211,
//     //         otp_code: 'doug.carter@orbispay.me'  //@TODO Add otp code 
//     //     };

//     //     chai.request(app).put('/employer-auth/reset-mpin/1/597CA0B4-E49D-EB11-85AA-2818783AB866')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)
//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.have.property('message', 'Mpin updated successfully');
//     //             expect(res).to.have.status(201);
//     // done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

//     // it('should not reset mpin for employer', (done) => {

//     //     const data = {
//     //         mpin: 1211,
//     //         otp_code: 'doug.carter@orbispay.me'  //@TODO Add otp code 
//     //     };

//     //     chai.request(app).put('/employer-auth/reset-mpin/1/597CA0B4-E49D-EB11-85AA-2818783AB866')
//     //         .set('content-type', 'application/json')
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .send(data)

//     //         .end((err, res) => {
//     //             should.exist(res);
//     //             res.should.be.an('object');
//     //             expect(res.body).to.not.have.property('message', 'Mpin updated successfully');
//     //             expect(res).to.have.status(401);
//     // done();
//     //         }).catch(function (err) {
//     //             throw err;
//     //         });
//     // }).timeout(20000);

});
