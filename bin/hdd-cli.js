#!/usr/bin/env node

'use strict'

const script = process.argv[2]
const spawn = require('cross-spawn')
const { program } = require('commander')
const version = require('../package.json').version
const init = require('../scripts/init')

program
  .version(version, '-v, --version, -V', '查看脚手架版本')
  .option('init', '初始化项目')

program.parse(process.argv)

if (script === 'init') {
  init()
}