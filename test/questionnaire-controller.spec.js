import Questionnaire from '../domain/questionnaire'
import express from 'express';
import dispatcher from '../web/questionnaireController';
let expect = require('chai').expect;
let sinon = require('sinon');
import request from 'supertest';
import log4js from 'log4js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import assert from 'assert';

describe('test find*', () => {
    let app;
    let findAll;
    let findById;

    before((done) => {
        //log4js.configure('./test/log4js-test.json');
        app = express().use('/', dispatcher);
        // Set up mocks
        findById = sinon.stub(Questionnaire, 'findById');
        findAll = sinon.stub(Questionnaire, 'find');
        done();
    });

    afterEach(() => {
        // reset all mocks created in before()
        findById.reset();
        findAll.reset();
    });


    it('should return all questionnaires', (done) => {
        var q1 = {
            title: 'Title 1',
            description: 'Description 1'
        };

        var q2 = {
            title: 'Title 2',
            description: 'Description 2'
        };

        var expectedQuestionnaires = [q1, q2];
        var err = false;
        findAll.yields(err, expectedQuestionnaires);

        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.length).to.equal(2);
                expect(res.body[0].title).to.equal('Title 1');
                expect(res.body[0].description).to.equal('Description 1');
                expect(res.body[1].title).to.equal('Title 2');
                expect(res.body[1].description).to.equal('Description 2');

                sinon.assert.calledOnce(findAll);
                done();
            });
    });

    it('should return one questionnaier', (done) => {
        let q1 = {
            title: 'Title 1',
            description: 'Description 1'
        };
        let err = false;
        findById.yields(err, q1);

        request(app)
            .get('/1')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.title).to.equal('Title 1');
                expect(res.body.description).to.equal('Description 1');
                sinon.assert.calledOnce(findById);

                done();
            });
    });

    it('should return NOT_FOUND if questionnaire does not exist', (done) => {
        var err = true;
        findById.yields(err, null);

        request(app)
            .get('/1000')
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                sinon.assert.calledOnce(findById);
                done();
            });
    });
    
});

describe('test delete*', () => {
    let remove;
    let findOne;
    let app;
    before((done) => {
        mongoose.Promise = global.Promise;
        app = express().use('/', dispatcher);
        remove = sinon.stub(Questionnaire, 'remove');
        findOne = sinon.stub(Questionnaire, 'findOne');
        done();
    });

    afterEach(() => {
        // reset all mocks created in before()
        remove.reset();
        findOne.reset();
    });

    it('should remove item', (done) => {
        var q1 = {
            id: 5,
            title: 'Title 1',
            description: 'Description 1'
        };
        var err = false;
        findOne.yields(err, q1);
        remove.yields(err);

        request(app)
            .delete('/5')
            .type('json')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                sinon.assert.calledOnce(findOne);
                sinon.assert.calledOnce(remove);
                done();
            });
    });

});


describe('test create*', () => {
    let app;
    let save;

    before((done) => {
        // configure logging
        //log4js.configure('./test/log4js-test.json');
        mongoose.Promise = global.Promise;
        // init app with the controller under test
        app = express()
            .use(bodyParser.json())
            .use('/', dispatcher);

        // setup mocks
        save = sinon.stub(Questionnaire.prototype, 'save');
        done();
    });

    afterEach(() => {
        // reset all mocks created in before()
        save.reset();
    });

    it('should return new questionnaire', (done) => {
        var q1 = {
            id: 5,
            title: 'Title 1',
            description: 'Description 1'
        };
        var err = false;
        save.yields(err, q1);

        request(app)
            .post('/')
            .type('json')
            .send({title: q1.title, description: q1.description})
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                //expect(res.body.id).to.equal(5);
                expect(res.body.title).to.equal('Title 1');
                expect(res.body.description).to.equal('Description 1');

                sinon.assert.calledOnce(save);

                done();
            });
    });
});
