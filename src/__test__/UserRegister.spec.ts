import request from 'supertest'
import app from '../app'
import sequelize from '../config/database'
import User from '../model/user.model'

beforeAll(() => {
    return sequelize.sync()
})

beforeEach(() => {
    return User.destroy({ truncate: true })
})

describe('User Registration', () => {
    const validUser = {
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'Pass1',
    }
    const postValid = (user: { username: string | null; email: string; password: string } = validUser) => {
        return request(app).post('/api/1.0/users').send(user)
    }
    it('return 200 OK when signup request is valid', async () => {
        const response = await postValid()
        expect(response.status).toBe(200)
    })

    it('return success message when signup request is valid', async () => {
        const response = await postValid()
        expect(response.body.message).toBe('User created')
    })

    it('Saves the user to database', async () => {
        await postValid()
        const userList = await User.findAll()
        expect(userList.length).toBe(1)
    })

    it('Saves the username and email to database', async () => {
        await postValid()
        const userList = await User.findAll()
        const savedUser = userList[0]
        expect(savedUser.username).toBe('user1')
        expect(savedUser.email).toBe('user1@gmail.com')
    })

    it('Hashes the password in database', async () => {
        await postValid()
        const userList = await User.findAll()
        const savedUser = userList[0]
        expect(savedUser.password).not.toBe('Pass1')
    })

    it('returns 400 when username is null', async () => {
        const response = await postValid({
            username: null,
            email: 'user1@gmail.com',
            password: 'Pass1',
        })
        expect(response.status).toBe(400)
    })
})
