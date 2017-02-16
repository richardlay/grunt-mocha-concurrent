/*
 * grunt-mocha-concurrent
 * https://github.com/richardlay/grunt-mocha-concurrent
 *
 * Copyright (c) 2017 Richard Lay
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    const Os = require("os");
    const _ = require("lodash");

    grunt.registerMultiTask('mocha_concurrent', 'Run mocha tests via concurrent grunt tasks.', function () {
        let options = this.options({
            envDefault: {},
            envTaskPrefix: "mocha-concurrent-env-",
            mochaTaskPrefix: "mocha-concurrent-test-",
            concurrentLimit: Os.cpus().length * 2 || 1
        });

        let specs = this.data.specs || [];

        const concurrentSpec = {
            tasks: [],
            options: {
                limit: options.concurrentLimit
            }
        };

        _.each(specs, (spec, i) => {
            let env = Object.assign({}, options.envDefault);
            grunt.config.set(`env.${options.envTaskPrefix}${i+1}`, Object.assign(env, spec.envSpec));
            grunt.config.set(`mochaTest.${options.mochaTaskPrefix}${i+1}`, spec.mochaSpec);
            concurrentSpec.tasks.push([`env:${options.envTaskPrefix}${i+1}`, `mochaTest:${options.mochaTaskPrefix}${i+1}`]);
        });

        grunt.config.set("concurrent.mocha-concurrent-tests", concurrentSpec);
        grunt.task.run(["concurrent:mocha-concurrent-tests"]);
    });

};
