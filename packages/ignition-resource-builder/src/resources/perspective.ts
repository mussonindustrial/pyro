import { Module, ModuleResourceFolder, ModuleResourceSingleton } from './common'

type StyleClass = {
    style: string | object
}

type GeneralProperties = {
    data: string
}

type PageConfig = {
    config: string | object
}

type SessionProperties = {
    props: string | object
}

type SessionScripts = {
    data: string
}

type Views = {
    view: string | object
    thumbnail: string
}

export interface PerspectiveModule extends Module {
    resources: {
        generalProps: ModuleResourceSingleton<GeneralProperties>
        pageConfig: ModuleResourceSingleton<PageConfig>
        sessionProperties: ModuleResourceSingleton<SessionProperties>
        sessionScripts: ModuleResourceSingleton<SessionScripts>
        styleClasses: ModuleResourceFolder<StyleClass>
        views: ModuleResourceFolder<Views>
    }
}

export const perspective: PerspectiveModule = {
    path: 'com.inductiveautomation.perspective',
    resources: {
        generalProps: {
            path: 'general-properties',
            files: { data: 'data.bin' },
        },
        pageConfig: {
            path: 'page-config',
            files: { config: 'config.json' },
        },
        sessionProperties: {
            path: 'session-props',
            files: { props: 'props.json' },
        },
        sessionScripts: {
            path: 'session-scripts',
            files: { data: 'data.bin' },
        },
        styleClasses: {
            path: 'style-classes',
            files: { style: 'style.json' },
        },
        views: {
            path: 'views',
            files: { view: 'view.json', thumbnail: 'thumbnail.png' },
        },
    },
}

export default perspective
