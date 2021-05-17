/**
 * Created by sony on 2016/9/26.
 */
 var chai = require('chai'),
 sinon = require('sinon'),
 sinonChai = require('sinon-chai');

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

global.dbURI = 'mongodb://127.0.0.1:27017/test';
global.clearDB = require('@finelets/hyper-rest/db/mongoDb/clearDB')(dbURI);

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
global.should = require('should');
chai.use(sinonChai);

const saveObjectToDb = require('@finelets/hyper-rest/db/mongoDb/SaveObjectToDb')
global.dbSave = (schema, data) => {
 return saveObjectToDb(schema, data)
     .then((data) => {
         return data.toJSON()
     })
}

global.insertDocsInSequential = function insertDocsInSequential(model, docs, callback) {
 var result = [];

 function iterate(index) {
     if (index === docs.length) return callback(null, result);
     new model(docs[index]).save(function (err, data) {
         if (err) return callback(err, result);
         result.push(data);
         iterate(index + 1);
     });
 }

 iterate(0);
};

global.insertDocsInParallel = function insertDocsInParallel(model, docs, callback) {
 var result = [];
 var finished = 0,
     errored = false;

 function done(err, data) {
     if (err) {
         errored = true;
         return callback(err);
     }
     result.push(data);
     ++finished;
     if (finished === docs.length && !errored) {
         return callback(null, result);
     }
 }

 docs.forEach(function (item) {
     new model(item).save(done);
 });
};

