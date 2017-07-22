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

describe("DELETE /todos/:id", () => {
    it("It should remove a todo by id", (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((err) => {
                done(err);
            });
        });
        // .end(done);
    });

    it("It should return a 404 for if todo id not found", (done) => {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it("It should return a 404 for object id is invalid", (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});
describe("PATCH /todos/:id", () => {
    it("It should update a todo by id", (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = {
            "text": "This should be the new text",
            "completed": true
        };
        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe('This should be the new text');
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            done();
        });
    });

    it("It should clear completedAt when todo is not completed", (done) => {
        var hexId = todos[1]._id.toHexString();
        var body = {
            "text": "This should be the new text for second todo",
            "completed": false
        };
        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("This should be the new text for second todo");
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }
            done();
        });
    });
});
