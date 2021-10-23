"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.schema = exports.DateTime = void 0;
var nexus_1 = require("nexus");
var graphql_scalars_1 = require("graphql-scalars");
exports.DateTime = (0, nexus_1.asNexusMethod)(graphql_scalars_1.DateTimeResolver, 'date');
var fs = require("fs");
var path = require("path");
var async = require("async");
var apollo_server_1 = require("apollo-server");
var Query = (0, nexus_1.objectType)({
    name: 'Query',
    definition: function (t) {
        var _this = this;
        t.nonNull.list.nonNull.field('directory_listing', {
            type: 'File',
            args: {
                path: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_parent, args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs.promises.stat(args.path)];
                        case 1:
                            if (!(_a.sent()).isDirectory()) {
                                throw new apollo_server_1.UserInputError('Path is not a directory');
                            }
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var directoryList = [];
                                    async.waterfall([
                                        function (cb) {
                                            fs.readdir(args.path, cb);
                                        },
                                        function (files, cb) {
                                            // Process the files in batches of 1000
                                            async.eachLimit(files, 1000, function (filename, done) {
                                                return __awaiter(this, void 0, void 0, function () {
                                                    var filePath, stats;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                filePath = path.join(args.path, filename);
                                                                return [4 /*yield*/, fs.promises.stat(filePath)];
                                                            case 1:
                                                                stats = _a.sent();
                                                                directoryList.push({
                                                                    path: filePath,
                                                                    size: stats.size,
                                                                    isDirectory: stats.isDirectory(),
                                                                    lastOpened: stats.atime,
                                                                    modifiedAt: stats.mtime,
                                                                    createdAt: stats.birthtime,
                                                                    ownerId: stats.uid,
                                                                    groupId: stats.gid,
                                                                    blocks: stats.blocks
                                                                });
                                                                done();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                });
                                            }, cb);
                                        }
                                    ], function (err) {
                                        if (err !== null) {
                                            reject(err);
                                        }
                                        resolve(directoryList);
                                    });
                                })];
                    }
                });
            }); }
        });
    }
});
var File = (0, nexus_1.objectType)({
    name: 'File',
    definition: function (t) {
        t.nonNull.string('path');
        t.nonNull.int('size');
        t.nonNull.boolean('isDirectory');
        t.nonNull.field('lastOpened', { type: 'DateTime' });
        t.nonNull.field('modifiedAt', { type: 'DateTime' });
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.int('ownerId');
        t.nonNull.int('groupId');
        t.nonNull.int('blocks');
    }
});
exports.schema = (0, nexus_1.makeSchema)({
    types: [
        Query,
        exports.DateTime,
        File,
    ],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts'
    }
});
