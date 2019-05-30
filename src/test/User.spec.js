/* eslint-disable linebreak-style */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable prefer-destructuring */
import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../index';

chai.use(chaiHttp);

const expect = chai.expect;
const userCredentials = {
  email: 'johndoe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  confirmPassword: 'password',
  phoneNumber: '08012345678',
  address: 'Birrel Avenue, Yaba, Lagos',
  isAdmin: false,
};

const userCredentialsWithWrongName = {
  email: 'johndoe@mail.com',
  firstName: 'John9',
  lastName: 'Doe',
  password: 'password',
  confirmPassword: 'password',
  phoneNumber: '08012345678',
  address: 'Birrel Avenue, Yaba, Lagos',
  isAdmin: false,
};

const userCredentialsWithWrongPhoneNumber = {
  email: 'johndoe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  confirmPassword: 'password',
  phoneNumber: '080123',
  address: 'Birrel Avenue, Yaba, Lagos',
  isAdmin: false,
};

const userCredentialsWithWrongPassword = {
  email: 'johndoe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'pass',
  confirmPassword: 'password',
  phoneNumber: '08012345678',
  address: 'Birrel Avenue, Yaba, Lagos',
  isAdmin: false,
};

const userCredentialsWithNonMatchingPasswords = {
  email: 'johndoe@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  confirmPassword: 'pass',
  phoneNumber: '08012345678',
  address: 'Birrel Avenue, Yaba, Lagos',
  isAdmin: false,
};

const returningUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: 'password',
};

const nonExistingUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johngdoe@mail.com',
  password: 'password',
};

describe('/POST user', () => {
  it('POST a new user', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signup')
      .set('Accept', 'application/json')
      .send(userCredentials)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.success).to.eql(true);
        expect(res.body.message).to.eql('User has been created');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });

  it('should throw a 400 error if name contains a digit', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signup')
      .set('Accept', 'application/json')
      .send(userCredentialsWithWrongName)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.success).to.eql(false);
        expect(res.body.message).to.eql('You cannot use digits in your name');
        done();
      });
  });

  it('should throw a 400 error if phone number is not 11 digits', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signup')
      .set('Accept', 'application/json')
      .send(userCredentialsWithWrongPhoneNumber)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.success).to.eql(false);
        expect(res.body.message).to.eql('Your phone number should be 11 digits');
        done();
      });
  });

  it('should throw a 400 error if password is less than 6 characters', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signup')
      .set('Accept', 'application/json')
      .send(userCredentialsWithWrongPassword)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.success).to.eql(false);
        expect(res.body.message).to.eql('Your password must be more than 6 characters');
        done();
      });
  });

  it('should throw a 400 error if passwords do not match', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signup')
      .set('Accept', 'application/json')
      .send(userCredentialsWithNonMatchingPasswords)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.success).to.eql(false);
        expect(res.body.message).to.eql("Your passwords don't match");
        done();
      });
  });

  it('Signin a returning user', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signin')
      .set('Accept', 'application/json')
      .send(returningUser)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.success).to.eql(true);
        expect(res.body.message).to.eql('User has been logged in');
        // expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Signin a returning user should fail if a user does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/user/auth/signin')
      .set('Accept', 'application/json')
      .send(nonExistingUser)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.success).to.eql(false);
        expect(res.body.message).to.eql('User does not exist');
        done();
      });
  });
});
