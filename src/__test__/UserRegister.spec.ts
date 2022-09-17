import request from 'supertest'
import app from '../app'

it('return 200 OK when signup request is valid', () => {
    request(app)
        .post('/api/1.0/users')
        .send({
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'Pass1',
        })
        .expect(200)
})
