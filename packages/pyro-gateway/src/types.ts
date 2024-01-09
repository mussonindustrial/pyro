export type GatewayEdition = 'standard' | 'edge' | 'maker'
export type EULA = 'Y'
export type ModuleIdentifier =
    | 'alarm-notification'
    | 'allen-bradley-drivers'
    | 'bacnet-driver'
    | 'dnp3-driver'
    | 'enterprise-administration'
    | 'iec-61850-driver'
    | 'logix-driver'
    | 'modbus-driver-v2'
    | 'omron-driver'
    | 'opc-ua'
    | 'perspective'
    | 'reporting'
    | 'serial-support-client'
    | 'serial-support-gateway'
    | 'sfc'
    | 'siemens-drivers'
    | 'sms-notification'
    | 'sql-bridge'
    | 'symbol-factory'
    | 'tag-historian'
    | 'udp-tcp-drivers'
    | 'vision'
    | 'voice-notification'
    | 'web-browser'
    | 'web-developer'
export type EAMType = 'Agent' | 'Controller'
export type SecurityPolicy = 'ApproveOnly' | 'SpecifiedList' | 'Unrestricted'

// GatewayNetwork contains settings for a gateway network connection.
export type GatewayNetwork = {
    HOST?: string
    PORT?: number
    PINGRATE?: number
    PINGMAXMISSED?: number
    ENABLED?: boolean
    ENABLESSL?: boolean
    WEBSCOKETTIMEOUT?: number
    DESCRIPTION?: string
}

// EnvironmentVariables is a set of variables that can be passed to an Ignition container.
export type EnvironmentVariables = {
    TZ?: string
    ACCEPT_IGNITION_EULA?: 'Y'
    GATEWAY_RESTORE_DISABLED?: boolean
    GATEWAY_ADMIN_USERNAME?: string
    GATEWAY_ADMIN_PASSWORD?: string
    GATEWAY_HTTP_PORT?: number
    GATEWAY_HTTPS_PORT?: number
    GATEWAY_GAN_PORT?: number
    IGNITION_EDITION?: GatewayEdition
    IGNITION_LICENSE_KEY?: string
    IGNITION_ACTIVATION_TOKEN?: string
    GATEWAY_NETWORK?: GatewayNetwork[]
    EAM_SETUP_INSTALLSELECTION?: EAMType
    EAM_AGENT_CONTROLLERSERVERNAME?: string
    EAM_AGENT_SENDSTATSINTERVAL?: number
    EAM_CONTROLLER_ARCHIVEPATH?: string
    EAM_CONTROLLER_DATASOURCE?: string
    EAM_CONTROLLER_ARCHIVELOCATION?: string
    EAM_CONTROLLER_LOWDISKTHRESHOLDMB?: number
    GATEWAY_MODULES_ENABLED?: ModuleIdentifier[]
    IGNITION_UID?: number
    IGNITION_GID?: number
    DISABLE_QUICKSTART?: boolean
    GATEWAY_NETWORK_ENABLED?: boolean
    GATEWAY_NETWORK_REQUIRESSL?: boolean
    GATEWAY_NETWORK_REQUIRETWOWAYAUTH?: boolean
    GATEWAY_NETWORK_SENDTHREADS?: number
    GATEWAY_NETWORK_RECEIVETHREADS?: number
    GATEWAY_NETWORK_RECEIVEMAX?: number
    GATEWAY_NETWORK_ALLOWINCOMING?: boolean
    GATEWAY_NETWORK_SECURITYPOLICY?: SecurityPolicy
    GATEWAY_NETWORK_WHITELIST?: string[]
    GATEWAY_NETWORK_ALLOWEDPROXYHOPS?: number
    GATEWAY_NETWORK_WEBSOCKETSESSIONIDLETIMEOUT?: number
}

export const DefaultEnvironmentVariables: EnvironmentVariables = {
    ACCEPT_IGNITION_EULA: 'Y',
    IGNITION_EDITION: 'standard',
    GATEWAY_ADMIN_USERNAME: 'admin',
    GATEWAY_ADMIN_PASSWORD: 'password',
    DISABLE_QUICKSTART: true,
    GATEWAY_HTTP_PORT: 8088,
    GATEWAY_HTTPS_PORT: 8043,
}

export type RuntimeArguments = {
    name?: string
    memoryMax?: number
    restorePath?: string
    debugMode?: boolean
}

export type CustomArguments = {
    installPath: string
}

export const DefaultCustomArguments: CustomArguments = {
    installPath: '/usr/local/bin/ignition',
}

export const GATEWAY_PATH = {
    DATA: '/data',
    LIB: '/lib',
    LOGS: '/logs',
    PERSPECTIVE_FONTS:
        '/data/modules/com.inductiveautomation.perspective/fonts',
    PERSPECTIVE_ICONS:
        '/data/modules/com.inductiveautomation.perspective/icons',
    PERSPECTIVE_THEMES:
        '/data/modules/com.inductiveautomation.perspective/themes',
    PROJECTS: '/data/projects',
    USER_LIB: '/user-lib',
} as const
export type GatewayPath =
    | (typeof GATEWAY_PATH)[keyof typeof GATEWAY_PATH]
    | (string & NonNullable<unknown>)

export type IgnitionFileToCopy = {
    folder: GatewayPath
    source: string
    name?: string
}
