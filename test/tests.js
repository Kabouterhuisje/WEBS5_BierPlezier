process.env.NODE_ENV = 'test';

var app = require('../app');
var Race = require('mongoose').model('Race');
var User = require('mongoose').model('User');
var Waypoint = require('mongoose').model('Waypoint');
var request = require('supertest');
var passportStub = require('passport-stub');
var expect = require('chai').expect;

passportStub.install(app);

// RACES

describe('RACES-ROUTES', function(){
    describe('HOME-RACE', function(){
        it('POST 200', function(done){
            request(app)
                .post('/races')
                .send({
                    _id: "5ab6e8fafae71100046bfb09",
                    name: "De enige echte race",
                    description: "Description of race",
                    date_start: new Date(),
                    status: "Open",
                    users: [
                        "5ab6e8fafae71100046bfb09"
                    ],
                    waypoints: []
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200 (after race added)', function(done){
            request(app)
                .get('/races')
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    expect(res.body).to.not.have.length(0);
                    done();
                })
        });
    });
    describe('CREATE-RACE', function(){
        it('GET 200 (as admin)', function(done){
            passportStub.login(new User({ admin: true }));
            request(app)
                .get('/races/create')
                .expect(200)
                .expect("Content-Type", "text/html; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
    });
    describe('RACE-GET', function(){
        it('GET 200 (race existing)', function(done){
            request(app)
                .get('/races/5ab6e8fafae71100046bfb09')
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('PUT 200', function(done){
            passportStub.login(new User({ admin: true }));
            request(app)
                .put('/races/5ab6e8fafae71100046bfb09')
                .send({ status: 'Closed' })
                .expect(200, "updated")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200 (new race)', function(done){
            request(app)
                .get('/races/5ab6e8fafae71100046bfb09/details')
                .expect(200)
                .expect("Content-Type", "text/html; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    expect(res.body).to.be.empty;
                    done();
                })
        });
    });


    describe('WAYPOINTS', function(){
        it('GET 200', function(done){
            request(app)
                .get('/races/5ab6e8fafae71100046bfb09/waypoints')
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('POST 200', function(done){
            request(app)
                .post('/races/5ab6e8fafae71100046bfb09/waypoints')
                .send({
                    _id: "551b8deeb45bcc7c2ab2b5fb",
                    placeid: "kdjdjsjkgsdkjgdshgh6jhjdjhjs",
                    name: "t'paultje",
                    latitude: "548574",
                    longitude: "868484",
                    users: [ "551ac0c4731065e817010716" ]
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('DELETE 200', function(done){
            request(app)
                .delete('/races/5ab6e8fafae71100046bfb09/waypoints')
                .send({ _id: "551b8deeb45bcc7c2ab2b5fb" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200', function(done){
            request(app)
                .get('/races/551a2e24da057118324a75b2/waypoints/create')
                .expect(200)
                .expect("Content-Type", "text/html; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200 (new race)', function(done){
            request(app)
                .get('/races/551a2e24da057118324a75b2/waypoints/551b8deeb45bcc7c2ab2b5fb/details')
                .expect(200)
                .expect("Content-Type", "text/html; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    expect(res.body).to.be.empty;
                    done();
                })
        });
    });
    describe('USERS', function(){
        it('POST 200', function(done){
            request(app)
                .post('/races/5ab6e8fafae71100046bfb09/users')
                .send({ _id: "551ac0c4731065e817010716" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200', function(done){
            request(app)
                .get('/races/5ab6e8fafae71100046bfb09/users')
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('DELETE 200', function(done){
            request(app)
                .delete('/races/5ab6e8fafae71100046bfb09/users')
                .send({ _id: "551ac0c4731065e817010716" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
    });

    describe('RACE-DELETE', function(){
        it('DELETE 200', function(done){
            passportStub.login(new User({ admin: true }));
            request(app)
                .delete('/races')
                .send({ _id: "551a2e24da057118324a75b2" })
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200 (race deleted)', function(done){
            request(app)
                .get('/races/551a2e24da057118324a75b2')
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(err, res){
                    if(err) { return done(err); }
                    expect(res.body).to.be.empty;
                    done();
                })
        });
    });
});

// USERS

describe('USERS-ROUTES', function(){
    describe('REGISTER', function(){
        it('POST 200 (not logged in, user not existing)', function(done){
            passportStub.logout();
            User.findOne({ 'local.email': "harend@vogelmail.nl" },function(err, user) {
                user.remove();
            });
            request(app)
                .post('/users/signup')
                .send({
                    email: 'harend@vogelmail.nl',
                    password: 'test',
                    admin: false,
                    age: 23,
                    last_name: "ln",
                    first_name: "fn",
                    _id: "551ac0c4731065e817010715"
                })
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
    });
    describe('LOGIN', function(){
        it('302 (not logged in)', function(done){
            request(app)
                .post('/users/login')
                .send({ email: 'harend@vogelmail.nl', password: 'test' })
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
    });
    describe('LOGOUT', function(){
        it('302 (not logged in)', function(done){
            request(app)
                .get('/users/logout')
                .expect(302)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
    });
});

// GENERAL

describe('INDEX-ROUTES', function(){
    describe('HOME-LOGIN', function(){
        it('GET 302 (not logged in)', function(done){
            request(app)
                .get('/')
                .expect(302)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                })
        });
        it('GET 200 (logged in)', function(done){
            passportStub.login(new User());
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    passportStub.logout();
                    done();
                })
        });
    });
    describe('MESSAGE', function(){
        it('POST 200 (no message)', function(done){
            request(app)
                .post('/message')
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('POST 200 (message: success)', function(done){
            request(app)
                .post('/message')
                .send({ success: "-" })
                .expect(200, "success")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('POST 200 (message: error)', function(done){
            request(app)
                .post('/message')
                .send({ error: "-" })
                .expect(200, "error")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('POST 200 (message: notice)', function(done){
            request(app)
                .post('/message')
                .send({ notice: "-" })
                .expect(200, "notice")
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
    });
    describe('PUBLIC-ASSETS', function(){
        it('GET 200', function(done){
            request(app)
                .get('/img/logo.png')
                .expect('Content-Type', "image/png")
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('GET 200', function(done){
            request(app)
                .get('/js/index.js')
                .expect('Content-Type', "application/javascript")
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('GET 200', function(done){
            request(app)
                .get('/css/style.css')
                .expect('Content-Type', "text/css; charset=UTF-8")
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
    });
    describe('SESSIONS', function(){
        it('GET 200 (logged out)', function(done){
            request(app)
                .get('/login')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('GET 302 (logged in)', function(done){
            passportStub.login(new User());
            request(app)
                .get('/login')
                .expect('Content-Type', "text/plain; charset=utf-8")
                .expect(302)
                .end(function(err, res){
                    if(err) { return done(err); }
                    passportStub.logout();
                    done();
                });
        });
        it('GET 200 (logged out)', function(done){
            request(app)
                .get('/register')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(200)
                .end(function(err, res){
                    if(err) { return done(err); }
                    done();
                });
        });
        it('GET 302 (logged in)', function(done){
            passportStub.login(new User());
            request(app)
                .get('/register')
                .expect('Content-Type', "text/plain; charset=utf-8")
                .expect(302)
                .end(function(err, res){
                    if(err) { return done(err); }
                    passportStub.logout();
                    done();
                });
        });
    });
});
