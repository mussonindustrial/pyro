import chalk from 'chalk'
import checkForUpdate from 'update-check'

import cliPkgJson from '../../package.json'

const update = checkForUpdate(cliPkgJson).catch(() => null)

export async function notifyUpdate() {
    try {
        const res = await update
        if (res?.latest) {
            console.log()
            console.log(
                chalk.yellow.bold(
                    'A new version of `create-perspective-theme` is available!'
                )
            )
            console.log()
        }
        process.exit()
    } catch (_e) {
        // ignore error
    }
}
