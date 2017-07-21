const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');

const todos = [{
    "text" : "This is first todo123"
}, {
    "text" : "This is second todo456"
}, {
    "text" : "This is third todo789"
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
        //done();
    }).then(() => done());
});

describe('POST /todos', () => {
    it('It should creat a new todo', (done) => {
        var text = "Test todo text";
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((response) => {
            expect(response.body.text).toBe(text);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Todo.find({"text": "Test todo text"}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('It should not creat a new todo for bad data', (done) => {
        var text = "";
        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .expect((response) => {
            expect(response.body.text).toBe(undefined);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(todos.length);
                //expect(todos[0].text).toBe(undefined);
                done();
            }).catch((err) => {
                done(err);
            });

        });
    });
});

describe("GET /todos", () => {
    it("It should fetch and get todos", (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(todos.length);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(todos.length);
                //expect(todos[0].text).toBe(undefined);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });
});
