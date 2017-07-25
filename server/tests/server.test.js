const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

const {User} = require('./../model/user');

// Used to perform task before each test case run
beforeEach(populateUsers);
beforeEach(populateTodos);

/**
 * Test cases for POST /todos
 * @param  {[type]} POST [description]
 * @param  {[type]} it   [description]
 * @return {[type]}      [description]
 */
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

describe('GET /users/me', () => {
    it('It should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('It should return 401 if user not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', 'some_invalid_token_string')
        .expect(401)
        .expect((res) => {
            expect(res.body).toExist({});
        })
        .end(done);
    });
});

describe('POST /users/login', () => {
    it("It should login user and return auth token", (done) => {
        request(app)
        .post("/users/login")
        .send(users[2])
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[2]._id).then((user) => {
                // expect(user.tokens[0]).toInclude({
                //     access:'auth',
                //     token:res.headers['x-auth']
                // });
                expect(user.tokens[0]).toBeA('object');
                done();
            }).catch((err) => done(err));
        })
    });

    it("It should reject invalid login", (done) => {
        var invalid_request_data = users[2];
        invalid_request_data.password = invalid_request_data.password+"Invalid_password";
        request(app)
        .post("/users/login")
        .send(invalid_request_data)
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => done(err));
    });
});

describe('POST /users', () => {
    it('It should create a user if everything is valid', (done) => {
        var email = "example@example.com";
        var password = "abcdefghijkl";
        var userData = {
            "name":"testUser1",
            "email": email,
            "password":password,
            "age":24,
            "location":"testLocation1",
        }
        request(app)
        .post('/users')
        .send(userData)
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((err) => done(err));
        });
    });

    it('It should return validation errors if request is invalid', (done) => {
        var email = "InvalidEmailString";
        var password = "ab";
        var userData = {
            "name":"testUser1",
            "password":password,
            "email": email,
            "age":24,
            "location":"testLocation1",
        }
        request(app)
        .post('/users')
        .send(userData)
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body._id).toNotExist();
            expect(res.body._id).toNotExist();
        })
        .end(done());
    });

    it('It should not create a user if email is already used', (done) => {
        var email = users[0].email;
        var password = "testUserPassword";
        var userData = {
            "name":"testUser1",
            "password":password,
            "email": email,
            "age":24,
            "location":"testLocation1",
        }
        request(app)
        .post('/users')
        .send(userData)
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body._id).toNotExist();
        })
        .end(done());
    });
});
