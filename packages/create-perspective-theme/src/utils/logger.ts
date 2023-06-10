import chalk from 'chalk'
import ora from 'ora'
import gradient from 'gradient-string'

const BLUE = '#0099F7'
const RED = '#F11712'
const YELLOW = '#FFFF00'

export const cliGradient = gradient(BLUE, RED)
export const blue = chalk.hex(BLUE)
export const red = chalk.hex(RED)
export const yellow = chalk.hex(YELLOW)

export const loader = (text: string) =>
    ora({
        text,
        spinner: {
            frames: ['   ', blue('>  '), blue('>> '), blue('>>>')],
        },
    })

export const info = (...args: any[]) => {
    console.log(blue.bold('>>>'), ...args)
}

export const error = (...args: any[]) => {
    console.error(red.bold('>>>'), ...args)
}

export const warn = (...args: any[]) => {
    console.error(yellow.bold('>>>'), ...args)
}

export const dimmed = (...args: any[]) => {
    console.log(chalk.dim(...args))
}

export const item = (...args: any[]) => {
    console.log(blue.bold('  •'), ...args)
}
