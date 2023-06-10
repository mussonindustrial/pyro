#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'

import { logger, notifyUpdate } from './utils'
import { create } from './commands'
import cliPkg from '../package.json'

const createCli = new Command()

// create
createCli
    .name(chalk.bold(logger.cliGradient('create-perspective-theme')))
    .description('Create a new Perspective theme.')
    .usage(`${chalk.bold('<project-directory> <package-manager>')} [options]`)
    .argument('[project-directory]')
    .argument('[package-manager]')
    .option(
        '--skip-install',
        'Do not run a package manager install after creating the project',
        false
    )
    .option(
        '-e, --example [name]|[github-url]',
        `
  An example to bootstrap the app with. You can use an example name
  from the official Turborepo repo or a GitHub URL. The URL can use
  any branch and/or subdirectory
`
    )
    .option(
        '-p, --example-path <path-to-example>',
        `
  In a rare case, your GitHub URL might contain a branch name with
  a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
  In this case, you must specify the path to the example separately:
  --example-path foo/bar
`
    )
    .version(cliPkg.version, '-v, --version', 'Output the current version')
    .helpOption('-h, --help', 'Display help for command')
    .action(create)

createCli
    .parseAsync()
    .then(notifyUpdate)
    .catch(async (reason) => {
        console.log()
        if (reason.command) {
            logger.error(`${chalk.bold(reason.command)} has failed.`)
        } else {
            logger.error('Unexpected error. Please report it as a bug:')
            console.log(reason)
        }
        console.log()
        await notifyUpdate()
        process.exit(1)
    })
