import handler from './api/register.js';

const req = {
  method: 'POST',
  body: {
    id: 'TEST-123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    college: 'Test College',
    department: 'CS',
    year: '1st',
    registeredAt: new Date().toISOString()
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Status:', this.statusCode);
    console.log('Response:', data);
  }
};

handler(req, res).catch(console.error);
