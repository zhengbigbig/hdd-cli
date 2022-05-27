#!/usr/bin/env node

'use strict'

const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const ora = require('ora')
const spawn = require('cross-spawn')

const PROJECT_TYPES = {
  ['webpack-react']: 'Webpack & React',
}

module.exports = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'type',
        message: '请选择需要初始化的项目类型',
        choices: [
          {
            name: 'Webpack & React',
            value: 'webpack-react',
          },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
      },
      {
        type: 'checkbox',
        name: 'dependencies',
        message: '选择需要安装的依赖',
        choices: [
          new inquirer.Separator(' = 可选安装 = '),
          {
            name: 'mobx',
          },
          {
            name: 'dayjs',
          },
          {
            name: 'lodash',
          },
        ],
      },
    ])
    .then((answers) => {
      const { type, name, dependencies } = answers
      const spinner = ora(`生成${PROJECT_TYPES[type]} ${name} 中`).start()

      const root = process.cwd()

      const appPath = path.resolve(root, name)
      const packageJson = path.resolve(appPath, 'package.json')
      fs.ensureDirSync(appPath)
      fs.copySync(path.resolve(__dirname, `../templates/${type}`), appPath)
      updatePackageJson(packageJson, { name })

      console.log(dependencies)
      const needInstall = ['add']

      dependencies.forEach((deps) => {
        if (deps === 'mobx') {
          needInstall.push('mobx', 'mobx-react')
        } else {
          needInstall.push(deps)
        }
      })
      console.log(needInstall)
      if (needInstall.length > 0) {
        spawn.sync('yarn', needInstall, {
          cwd: appPath,
          stdio: 'inherit',
        })
      }
      spinner.succeed(`生成项目 ${name} 成功... 请查看项目 README.md 进行开发`)
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    })
}

/**
 * 更新 package.json 文件内容
 * @param {File} packageJson package.json 文件
 * @param {object} overrides 需修改的字段
 */
function updatePackageJson(packageJson, overrides = {}) {
  const data = fs.readJSONSync(packageJson)
  for (let key in overrides) {
    data[key] = overrides[key]
  }
  fs.writeJSONSync(packageJson, data, { spaces: 2 })
}
