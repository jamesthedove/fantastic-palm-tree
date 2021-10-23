const fs = require('fs');
const path = require('path');
const os = require('os');

const chai = require('chai');

const expect = chai.expect;

const url = `http://localhost:4000`;

const request = require('supertest')(url);

let directory;

before(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "directory_listing"));
    fs.writeFileSync(path.join(directory, "test_1.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_2.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_3.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_4.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_5.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_6.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_7.txt"), "Hello");
    fs.writeFileSync(path.join(directory, "test_8.txt"), "Hello");
    console.log(directory);
});

after(() => {
    fs.rmdirSync(directory, {recursive: true});
});

describe('GraphQL', () => {
    it('Returns all attributes', (done) => {
        request.post('/graphql')
            .send({ query: `
                query {
                    directory_listing(path: "${directory}"){
                        path,
                        size,
                        isDirectory
                        lastOpened
                        modifiedAt
                        createdAt
                        ownerId
                        groupId
                        blocks
                    }
                }

            `})
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);

                expect(res.body.data.directory_listing).to.be.an('array').that.has.lengthOf(8);
                expect(res.body.data.directory_listing[0].path).to.be.a('string');
                expect(res.body.data.directory_listing[0].size).to.be.a('number');
                expect(res.body.data.directory_listing[0].isDirectory).to.be.a('boolean');
                expect(res.body.data.directory_listing[0].lastOpened).to.be.a('string');
                expect(res.body.data.directory_listing[0].modifiedAt).to.be.a('string');
                expect(res.body.data.directory_listing[0].createdAt).to.be.a('string');
                expect(res.body.data.directory_listing[0].ownerId).to.be.a('number');
                expect(res.body.data.directory_listing[0].groupId).to.be.a('number');
                expect(res.body.data.directory_listing[0].blocks).to.be.a('number');

                expect(res.body.data.directory_listing[0].isDirectory).to.be.eq(false);

                done();
            })
    });

    it('Returns an error if directory does not exist', (done) => {
        request.post('/graphql')
            .send({ query: `
                query {
                    directory_listing(path: "${directory}/random"){
                        path,
                        size,
                        isDirectory
                        lastOpened
                        modifiedAt
                        createdAt
                        ownerId
                        groupId
                        blocks
                    }
                }

            `})
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);
                expect(res.body.errors[0].message).to.be.a('string');
                done();
            })
    });


});