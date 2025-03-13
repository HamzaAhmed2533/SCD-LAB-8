const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Adjust the path as needed

chai.use(chaiHttp);
const { expect } = chai;

describe('Events API', () => {
  it('should create a new event', (done) => {
    chai.request(app)
      .post('/events')
      .send({
        category: 'Meeting',
        date: '2025-03-13',
        description: 'Team Meeting',
        time: '10:00 AM',
        reminder: 30
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('eventId');
        done();
      });
  });

  it('should get an event by ID', (done) => {
    chai.request(app)
      .get('/events/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('eventId', 1);
        done();
      });
  });
});