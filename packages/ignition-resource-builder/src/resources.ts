export interface Resource {
    path: string
    key: string
}

export interface ResourceType {
    key: string
    path: string
    singleton: boolean
}

// ResourceType for Perspective General Properties
export const PerspectiveGeneral: ResourceType = {
    key: 'perspective-general-properties',
    path: 'general-properties',
    singleton: false,
}

// ResourceType for Perspective Page Configuration
export const PerspectivePageConfig: ResourceType = {
    key: 'perspective-page-config',
    path: 'page-config',
    singleton: true,
}

// ResourceType for Perspective Session Properties
export const PerspectiveSessionProps: ResourceType = {
    key: 'perspective-general-properties',
    path: 'session-props',
    singleton: true,
}

// ResourceType for Perspective Session Scripts
export const PerspectiveSessionScript: ResourceType = {
    key: 'perspective-session-scripts',
    path: 'session-scripts',
    singleton: true,
}

// ResourceType for Perspective Style Classes
export const PerspectiveStyleClass: ResourceType = {
    key: 'perspective-style-class',
    path: 'style-classes',
    singleton: false,
}

// ResourceType for Perspective Views
export const PerspectiveView: ResourceType = {
    key: 'perspective-view',
    path: 'views',
    singleton: false,
}
