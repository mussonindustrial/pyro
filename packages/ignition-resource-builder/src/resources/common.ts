export interface Module {
    path: string
    resources: {
        [key: string]:
            | ModuleResourceFolder<unknown>
            | ModuleResourceSingleton<unknown>
    }
}

export interface ModuleResourceSingleton<T> {
    path: string
    files: Record<keyof T, string>
    content?: T
}

export interface ModuleResourceFolder<T> {
    path: string
    files: Record<keyof T, string>
    root?: ResourceFolder<T>
}

export interface ResourceNode<T> {
    content: T
}

export interface ResourceFolder<T> {
    children: Record<string, ResourceNode<T> | ResourceFolder<T>>
}

export function isModuleResourceFolder<T>(
    resource: unknown
): resource is ModuleResourceFolder<T> {
    return (resource as ModuleResourceFolder<T>).root != undefined
}

export function isModuleResourceSingleton<T>(
    resource: unknown
): resource is ModuleResourceSingleton<T> {
    return (resource as ModuleResourceSingleton<T>).content != undefined
}

export function isResourceFolder<T>(
    resource: unknown
): resource is ResourceFolder<T> {
    return (resource as ResourceFolder<T>).children != undefined
}

export function isResourceNode<T>(
    resource: unknown
): resource is ResourceNode<T> {
    return (resource as ResourceNode<T>).content != undefined
}

interface resourceJSON {
    files: string[]
}

export function newResourceJSON(options: resourceJSON): string {
    return JSON.stringify(
        {
            files: options.files,
        },
        null,
        2
    )
}
