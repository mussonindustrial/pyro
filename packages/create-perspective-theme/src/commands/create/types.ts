export type CreateCommandArgument = string | undefined

export type PackageManager = 'npm' | 'pnpm' | 'yarn'
export type PackageManagerDetails = {
    name: PackageManager
    version?: string
}

export interface CreateCommandOptions {
    skipInstall?: boolean
    skipTransforms?: boolean
    turboVersion?: string
    example?: string
    examplePath?: string
}
