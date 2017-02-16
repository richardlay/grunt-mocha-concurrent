/*
 * grunt-mocha-concurrent
 * https://github.com/richardlay/grunt-mocha-concurrent
 *
 * Copyright (c) 2017 Richard Lay
 * Licensed under the MIT license.
 */

exports.init = function (grunt) {
    grunt.config.merge(JSON.parse(grunt.option("grunt-mocha-concurrent-config") || "{}"));
};
