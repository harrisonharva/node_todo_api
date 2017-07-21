const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');

const todos = [{
    "_id": new ObjectID(),
    "text" : "This is first todo123"
}, {
    "_id": new ObjectID(),
    "text" : "This is second todo456"
}, {
    "_id": new ObjectID(),
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

describe("GET /todos/:id", () => {
    it("It should return a todo by id", (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it("It should return a 404 for invalid id of todo by id", (done) => {
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((res) => {
            //expect(res.body).toBe({});
        })
        .end(done);
    });

    it("It should return a 404 for non-object ids", (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .expect((res) => {
            //expect(res.body).toBe({});
        })
        .end(done);
    });

});
