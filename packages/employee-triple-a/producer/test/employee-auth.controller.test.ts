import { HttpStatus } from '@nestjs/common';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
chai.use(chaiHttp);
const expect = chai.expect;



describe('Employee Auth API Test', () => {
    const app = 'http://localhost:4000/v1';
    let should = chai.should();
    const assert = require('assert');
    var token = ""

      it('should login the user', (done) => {
      const data = {
        login_type: 0,
        email: 'doug.carter@orbispay.me',
        password: 'Test@12345',
      };
      
        chai.request(app)
        .post('/employee-auth/login')
        .set('content-type', 'application/json')  
        .send(data)
        .end((err, res) => {
              console.log("Response object")
               token = res.body.data.payload.access_token,  //getting token value
              res.should.have.status(201);
              done();
        });

    }).timeout(20000);

    it('should not login the user', (done) => {
      const data = {
        login_type: 0,
        email: 'doug.carter@gmail.com',
        password: 'Test@12345',
      };
      
        chai.request(app)
        .post('/employee-auth/login')
        .type('form')
        .set('content-type', 'application/json')
        .send(data)
        .end((err, res) => {
              res.should.have.status(401);
          done();
        });
    }).timeout(20000);


    it('should not login the user', (done) => {
      const data = {
        login_type: 0,
        email: 'doug.carter@gmail.com',
        password: 'Test@12345',
      };
      
        chai.request(app)
        .post('/employee-auth/login')
        .type('form')
        .set('content-type', 'application/json')
        .send(data)
        .end((err, res) => {
              res.should.have.status(401);
              expect(res.body).to.have.property('message', 'Account not found for this email. Please create new account from the Login screen.');
          done();
        });
    }).timeout(20000);

    it('should reset mpin for user', (done) => {
      const data = {
        mpin: "1212",
        otp_code: '675198' 
      };
      
      chai.request(app)
      .put('/employee-auth/reset-mpin')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        done()
      });
    }).timeout(20000);

    it('should not reset mpin for user',  (done) => {
      const data = {
        mpin: "1212",
        otp_code: '727925' 
      };
      
      chai.request(app)
      .put('/employee-auth/reset-mpin')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .then(res => {
        res.should.have.status(400);
        done()
      }).catch(function (err) {
        throw err;
    });
    }).timeout(20000);

    it('should send forgot mpin mail', (done) => {
      const data = {
        first_name: "Douglas",   
        email: 'doug.carter@orbispay.me'  
      };
     // console.log("TOKEN");
     // console.log(token);
      chai.request(app)
      .put('/employee-auth/forgot-mpin')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    }).timeout(20000);


    
    it('should change mpin for user', (done) => {
      const data = {
        mpin:"1212",
        new_mpin:"1551"
      }; 
      chai.request(app)
      .put('/employee-auth/change-mpin')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    }).timeout(20000);

    it('should not change mpin for user', (done) => {
      //done.timeout(5000);
      const data = {
        mpin:"1221",
        new_mpin:"1111" //@TODO decode value
      }; 
      chai.request(app)
      .put('/employee-auth/change-mpin')
      .send(data)
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    }).timeout(20000);


    it('should change password for user', (done) => {
      const data = {
        password:'Test@1234',
        new_password: 'Test@12345'      
      }; 
      chai.request(app)
      .put('/employee-auth/change-password')
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
      }).timeout(20000);


    it('should not change password for user', (done) => {
      //done.timeout(5000);
      const data = {
        password:'Test@1234',
        new_password: 'Test@12345'
      }; 
      chai.request(app)
      .put('/employee-auth/change-password')
      .send(data)
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    }).timeout(20000);

    it('should reset password for user', (done) => {
      //done.timeout(5000);
      const data = {
        password:'Test@12345', 
        otp_code:'222795' //Need a valid OTP_code
      }; 
      chai.request(app).put('/employee-auth/reset-password')
      .send(data)
      .set('content-type', 'application/json')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    }).timeout(20000);


  it('should not reset password for user',(done) => {
    const data = {
      password:'Test@1234', 
      otp_code:'918435'
    }; 
    chai.request(app)
    .put('/employee-auth/reset-password')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
  }).timeout(20000);

  it('should verify mpin for user', (done) => {
    const data = {
      mpin:"1551"
    }; 
    chai.request(app)
    .post('/employee-auth/verify-mpin')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(201);
      done();
    });
  }).timeout(20000);


  it('should not verify mpin for user', (done) => {
    const data = {
      mpin:"1550"
    }; 
    chai.request(app)
    .post('/employee-auth/verify-mpin')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
  }).timeout(20000);


  it('should set mpin for user',  (done) => {
    const data = {
      mpin:"1551"
    }; 
    chai.request(app).put('/employee-auth/mpin')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  }).timeout(20000);

  it('should not set mpin for user', async (done) => {
    const data = {
      mpin:"1551"
    }; 
    chai.request(app).put('/employee-auth/mpin')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
  }).timeout(20000);


  it('should verify otp for user',  (done) => {
    const data = {
      otp_code:"346746"  //@TODO need a valid otp
    }; 
    chai.request(app).post('/employee-auth/verify-otp')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  }).timeout(20000);


  it('should not  verify otp for user', (done) => {
    const data = {
      otp_code:"184351" //invalid otp code
    }; 
    chai.request(app).post('/employee-auth/verify-otp')
    .set('content-type', 'application/json')
    .set({ Authorization: `Bearer ${token}` })
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
  }).timeout(20000);


  it('should send email for forgot password', (done) => {
    const data = {
      email:"david.hazan@orbispay.me"
    }; 
    chai.request(app).post('/employee-auth/forgot-password')
    .send(data)
    .end((err, res) => {
      res.should.have.status(201);
      expect(res.body).to.have.property('message', 'Please check your email for code');
      done();
    });
  }).timeout(20000);

  it('should not send email for forgot password', (done) => {
    const data = {
      email:"ron1.dvari@orbispay.me"
    }; 
    chai.request(app).post('/employee-auth/forgot-password')
    .send(data)
    .end((err, res) => {
      res.should.have.status(404);
      expect(res.body).to.have.property('message', 'Employee with email address not found');      
      done();
    });
  }).timeout(20000);

  it('should refresh token', async (done) => {
    //done.timeout(5000);
    const data = {
      email:"1551"
    }; 
    chai.request(app).post('/employee-auth/token/refresh')
    .send(data)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  }).timeout(20000);

  it('should change password for idx', (done) => {
    chai.request(app).get('/employee-auth/changepwd/1ED77BC8-E59D-EB11-85AA-2818783AB866')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  }).timeout(20000);


  it('should not signup user', (done) => {
    const data = {
      idx:"1ED77BC8-E59D-EB11-85AA-2818783AB866",
      password:"Test@12345",
      email:"john.dvari@orbispay.me"
    }; 
    chai.request(app)
    .post('/employee-auth/signup')
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      expect(res.body).to.have.property('message', 'Employee is already registered');
      done();
    });
  }).timeout(20000);

  it('should not signup user', (done) => {
    const data = {
      idx:"549c33cc-a8f1-11eb-bcbc-0242ac130002",
      password:"1234",
      email:"ron.dvari@orbispay.me"
    }; 
    chai.request(app).post('/employee-auth/signup')
    .send(data)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
  }).timeout(20000);

   });
