/*
 * slush-switchboard
 * https://github.com/shannon/slush-switchboard
 *
 * Copyright (c) 2016, Shannon Archer
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || '',
	      zipFilename: workingDirName + '.zip',
        contentWidth: 1920,
        contentHeight: 1080,
	contentType: 'basic'
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'contentWidth',
        message: 'What is the content width?',
        default: defaults.contentWidth
    }, {
        name: 'contentHeight',
        message: 'What is the content height?',
        default: defaults.contentHeight
    }, {
	type: 'list',
	name: 'contentType',
	message: 'What is the content type?',
	default: defaults.contentType,
	choices: [
		{ name: 'Basic', value: 'basic' },
		{ name: 'Rotator', value: 'rotator' }
	]
    }, {
      	name: 'zipFilename',
      	message: 'What is the name of the zip file?',
      	default: defaults.zipFilename
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/' + answers.contentType + '/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
		    if (file.extname != '.scss' && file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
