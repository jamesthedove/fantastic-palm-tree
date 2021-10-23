# Directory Listing


- [Getting Started](#getting-started)

## Getting started

Run the app

```shell
docker-compose up
```

The app is accessible via `http://localhost:4000/graphql` by default.

## Test the API

You can use the path `/usr/src/app` to list the files in the working directory when running it via docker

```graphql
query {
  directory_listing(path: "/full/path/to/directory"){
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
```

## Run Unit test

```shell
npm test
```

Note that this currently requires the server to be running before running the test.