# grunt-mocha-concurrent

> Run mocha tests via concurrent grunt tasks.

## Installation

```shell
npm install grunt-mocha-concurrent --save-dev
```

## Overview

Even though there are lots of posts online that don't recommend running tests in parallel, I've almost halved the time it takes for my tests to run. Sure, it can be harder to debug issues, but since this uses `grunt-concurrent` to spawn separate processes there won't be any "cross wire" bugs. Besides, if a test fails you can just revert to running your regular serial grunt test task along with a mocha `.only`. But when things are green then why not go faster? :thumbsup:

## Getting started

This plugin requires `grunt-mocha-test` and `grunt-concurrent`. `grunt-env` is optional.

Check that your `Gruntfile.js` looks something similar to this. It's important that `Concurrent.init(grunt);` appears *after* you call `initConfig()`.

```js
const Concurrent = require("grunt-mocha-concurrent");
...
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-mocha-concurrent');
...
grunt.initConfig({
  ...
});
Concurrent.init(grunt);

```

## Simple example

If your tests don't have any central external dependencies like a database, then this is the example for you.

```js
grunt.initConfig({
  ...
  mocha_concurrent: {
    your_target: {
      specs: [
        {
          mochaSpec: {
            options: { 
              reporter: 'dot', 
              timeout: '2000'
            },
            src: ['tests/unit/**/test*.js']
          }
        },
        {
          mochaSpec: {
            options: { 
              reporter: 'dot', 
              timeout: '2000'
            },
            src: ['tests/functional/**/test*.js']
          }
        }        
      ]
    },
  }
  ...
});
...
grunt.registerTask('spec:concurrent', ['mocha_concurrent:your_target']);
```

When you run `grunt spec:concurrent` it will run your unit tests and your functional tests in parallel.
`mochaSpec` is just forwarded directly to `grunt-mocha-test` so look up their documentation for the specification.

## Advanced example

But say your functional tests read/write to the database. You can't run parallel tests in the same process as your tests will step all over each other. So we can get around this by using different database instances.

If you use an environment variable to control the test database to connect to, then you can use this example. This assumes that your test framework will create your database/schema for you. I'm using mongodb so this just happens automagically.

```js
grunt.initConfig({
  grunt.loadNpmTasks('grunt-env');
  ...
  mocha_concurrent: {
    your_target: {
      specs: [
        {
          mochaSpec: {
            options: { 
              reporter: 'dot', 
              timeout: '2000'
            },
            src: ['tests/unit/**/test*.js']
          }
        },
        {
          mochaSpec: {
            options: { 
              reporter: 'dot', 
              timeout: '2000'
            },
            src: ['tests/functional/controllers/**/test*.js']
          },
          envSpec: {
            MONGODB_URI: 'mongodb://localhost:27017/my-test-db-1'
          }          
        },
        {
          mochaSpec: {
            options: { 
              reporter: 'dot', 
              timeout: '2000'
            },
            src: ['tests/functional/models/**/test*.js']
          },
          envSpec: {
            MONGODB_URI: 'mongodb://localhost:27017/my-test-db-2'
          }
        }
      ]
    },
  }
  ...
});
...
grunt.registerTask('spec:concurrent', ['mocha_concurrent:your_target']);
```

When you run `grunt spec:concurrent` it will run your unit tests and two of your functional test flavours in parallel.

## Default Options

```js
grunt.initConfig({
  mocha_concurrent: {
    options: {
      concurrentLimit: 1,   // Number of concurrent tasks to run in parallel. Defaults to number of cpu cores.
      envDefault: {},       // Environment variables to pass to all tasks. Defaults to null.
      envTaskPrefix: "",    // Prefix to use for grunt-env tasks. Defaults to mochaConcurrent-.
      mochaTaskPrefix: "",  // Prefix to use for grunt-env tasks. Defaults to mochaConcurrent-.
    },
    ...
  },
});
```

## Tips
In thi

## Release History
_(Nothing yet)_
