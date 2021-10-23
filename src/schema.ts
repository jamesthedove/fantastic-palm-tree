import {
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  asNexusMethod,
} from 'nexus'

import { DateTimeResolver } from 'graphql-scalars'
export const DateTime = asNexusMethod(DateTimeResolver, 'date')

import * as fs from 'fs';
import * as path from "path";
import * as async from 'async';
import {UserInputError} from "apollo-server";

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('directory_listing', {
      type: 'File',
      args: {
        path: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {

        if (!(await fs.promises.stat(args.path)).isDirectory()){
          throw new UserInputError('Path is not a directory');
        }

        return new Promise((resolve, reject) => {

          const directoryList: { path: string; size: number; isDirectory: boolean; lastOpened: Date,  modifiedAt: Date,  createdAt: Date,  ownerId: number,  groupId: number,  blocks: number }[] = [];
          async.waterfall([
            function (cb: (err: NodeJS.ErrnoException | null, files: string[]) => void) {
              fs.readdir(args.path, cb);
            },
            function (files: async.IterableCollection<string>, cb: async.ErrorCallback) {
              // Process the files in batches of 1000
              async.eachLimit(files, 1000, async function (filename: string, done) {
                const filePath = path.join(args.path, filename);

                const stats = await fs.promises.stat(filePath);

                directoryList.push({
                  path: filePath,
                  size: stats.size,
                  isDirectory: stats.isDirectory(),
                  lastOpened: stats.atime,
                  modifiedAt: stats.mtime,
                  createdAt: stats.birthtime,
                  ownerId: stats.uid,
                  groupId: stats.gid,
                  blocks: stats.blocks,
                });

                done();
              }, cb);
            }
          ], function (err) {
             if (err !== null){
               reject(err);
             }

            resolve(directoryList);
          });

        });

      }
    });
  },
})

const File = objectType({
  name: 'File',
  definition(t) {
    t.nonNull.string('path')
    t.nonNull.int('size')
    t.nonNull.boolean('isDirectory')
    t.nonNull.field('lastOpened', { type: 'DateTime' })
    t.nonNull.field('modifiedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.int('ownerId')
    t.nonNull.int('groupId')
    t.nonNull.int('blocks')
  },
});


export const schema = makeSchema({
  types: [
    Query,
    DateTime,
    File,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
})
