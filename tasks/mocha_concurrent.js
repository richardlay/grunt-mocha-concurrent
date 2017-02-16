/*
 * grunt-mocha-concurrent
 * https://github.com/richardlay/grunt-mocha-concurrent
 *
 * Copyright (c) 2017 Richard Lay
 * Licensed under the MIT license.
 */
module.exports = grunt => {

    const Os = require("os");
    const _ = require("lodash");

    grunt.registerMultiTask('mocha_concurrent', 'Run mocha tests in parallel using concurrent grunt tasks.', () => {
        let options = this.options({
            envDefault: null,
            envTaskPrefix: "mochaConcurrent-",
            mochaTaskPrefix: "mochaConcurrent-",
            concurrentLimit: Os.cpus().length || 1
        });

        let specs = this.data.specs || [];

        const concurrentSpec = {
            tasks: [],
            options: {
                limit: options.concurrentLimit
            }
        };

        const gruntConfig = {};

        _.each(specs, (spec, i) => {
            let name = spec.name || "" + (i+1);
            name = name.replace(/[^a-zA-Z0-9\/\*]/g,'_');   // Remove chars that might not play nice as a cmd line flag
            const task = [];
            if (options.envDefault || spec.envSpec) {
                let env = Object.assign({}, options.envDefault);
                const envTarget = `${options.envTaskPrefix}${name}`;
                _.set(gruntConfig, `env.${envTarget}`, Object.assign(env, spec.envSpec));
                task.push(`env:${envTarget}`);
            }
            const mochaTarget = `${options.mochaTaskPrefix}${name}`;
            _.set(gruntConfig, `mochaTest.${mochaTarget}`, spec.mochaSpec);
            task.push(`mochaTest:${mochaTarget}`);
            concurrentSpec.tasks.push(task);
        });

        grunt.config("concurrent.mocha-concurrent-tests", concurrentSpec);
        grunt.option("grunt-mocha-concurrent-config", JSON.stringify(gruntConfig));  // Workaround to pass config to new task
        grunt.task.run(["concurrent:mocha-concurrent-tests"]);
    });
};
