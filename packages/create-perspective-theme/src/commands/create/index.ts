import path from 'path'
import chalk from 'chalk'
import type { Project } from '@turbo/workspaces'
import {
    getWorkspaceDetails,
    install,
    getPackageManagerMeta,
    ConvertError,
} from '@turbo/workspaces'
import type { CreateCommandArgument, CreateCommandOptions } from './types'
import * as prompts from './prompts'
import { logger, getAvailablePackageManagers, isOnline } from '../../utils'

const { cliGradient, turboLoader, info, error, warn } = logger

function handleErrors(err: unknown) {
    // handle errors from ../../transforms
    if (err instanceof ConvertError && err.type !== 'unknown') {
        error(chalk.red(err.message))
        process.exit(1)
        // handle unknown errors (no special handling, just re-throw to catch at root)
    } else {
        throw err
    }
}

const SCRIPTS_TO_DISPLAY: Record<string, string> = {
    build: 'Build',
    dev: 'Develop',
    test: 'Test',
    lint: 'Lint',
}

export async function create(directory, packageManager, opts) {
    const { skipInstall, skipTransforms } = opts

    console.log(chalk.bold(cliGradient(`\n>>> Perspective Theme\n`)))
    info(`Welcome! Let's get you set up with a new theme project.`)
    console.log()

    const [online, availablePackageManagers] = await Promise.all([
        isOnline(),
        getAvailablePackageManagers(),
    ])

    if (!online) {
        error(
            'You appear to be offline. Please check your network connection and try again.'
        )
        process.exit(1)
    }

    const { root, projectName } = await prompts.directory({ directory })
    const relativeProjectDir = path.relative(process.cwd(), root)
    const projectDirIsCurrentDir = relativeProjectDir === ''

    // selected package manager can be undefined if the user chooses to skip transforms
    const selectedPackageManagerDetails = await prompts.packageManager({
        packageManager,
        skipTransforms,
    })

    if (packageManager && opts.skipTransforms) {
        warn(
            '--skip-transforms conflicts with <package-manager>. The package manager argument will be ignored.'
        )
    }

    const { example, examplePath } = opts
    const exampleName = example && example !== 'default' ? example : 'basic'
    const { hasPackageJson, availableScripts, repoInfo } = await createProject({
        appPath: root,
        example: exampleName,
        // isDefaultExample: isDefaultExample(exampleName),
        examplePath,
    })

    // read the project after creating it to get details about workspaces, package manager, etc.
    let project: Project = {} as Project
    try {
        project = await getWorkspaceDetails({ root })
    } catch (err) {
        handleErrors(err)
    }

    // run any required transforms
    if (!skipTransforms) {
        for (const transform of transforms) {
            try {
                const transformResult = await transform({
                    example: {
                        repo: repoInfo,
                        name: exampleName,
                    },
                    project,
                    prompts: {
                        projectName,
                        root,
                        packageManager: selectedPackageManagerDetails,
                    },
                    opts,
                })
                if (transformResult.result === 'success') {
                    tryGitCommit(
                        `feat(create-turbo): apply ${transformResult.name} transform`
                    )
                }
            } catch (err) {
                handleErrors(err)
            }
        }
    }
}
