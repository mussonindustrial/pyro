import {
    AbstractStartedContainer,
    GenericContainer,
    StartedTestContainer,
    Wait,
} from 'testcontainers'
import { convertValuesToStringsDeep } from './util'

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

function expandNetworks(networks: GatewayNetwork[]) {
    let result = {}
    for (const [index, network] of networks.entries()) {
        result = {
            ...result,
            [`GATEWAY_NETWORK_${index}_HOST`]: network.HOST,
            [`GATEWAY_NETWORK_${index}_PORT`]: network.PORT,
            [`GATEWAY_NETWORK_${index}_PINGRATE`]: network.PINGRATE,
            [`GATEWAY_NETWORK_${index}_PINGMAXMISSED`]: network.PINGMAXMISSED,
            [`GATEWAY_NETWORK_${index}_ENABLED`]: network.ENABLED,
            [`GATEWAY_NETWORK_${index}_ENABLESSL`]: network.ENABLESSL,
            [`GATEWAY_NETWORK_${index}_WEBSCOKETTIMEOUT`]:
                network.WEBSCOKETTIMEOUT,
            [`GATEWAY_NETWORK_${index}_DESCRIPTION`]: network.DESCRIPTION,
        }
    }
    return result
}

function envToStringKeys(env: EnvironmentVariables): Record<string, string> {
    let out = {
        ...DefaultEnvironmentVariables,
        ...env,
    }

    if (env.GATEWAY_NETWORK) {
        delete out.GATEWAY_NETWORK
        out = {
            ...out,
            ...expandNetworks(env.GATEWAY_NETWORK),
        }
    }

    return convertValuesToStringsDeep(out)
}

export class IgnitionContainer extends GenericContainer {
    version?: string
    env: EnvironmentVariables = {}
    runtime: RuntimeArguments = {}

    constructor(version: string) {
        super('inductiveautomation/ignition:' + version)
    }

    public getOrDefaultEnv<Key extends keyof EnvironmentVariables>(key: Key) {
        if (this.env[key]) {
            return this.env[key]
        } else if (DefaultEnvironmentVariables[key]) {
            return DefaultEnvironmentVariables[key]
        }
    }

    public withEdition(edition: GatewayEdition) {
        this.env.IGNITION_EDITION = edition
        return this
    }

    public withHTTPPort(port: number) {
        this.env.GATEWAY_HTTP_PORT = port
        return this
    }

    public withHTTPSPort(port: number) {
        this.env.GATEWAY_HTTPS_PORT = port
        return this
    }

    public withModules(modules: ModuleIdentifier[]) {
        this.env.GATEWAY_MODULES_ENABLED = modules
        return this
    }

    public withGatewayName(name: string) {
        this.runtime.name = name
        return this
    }

    public withGatewayBackup(path: string) {
        this.runtime.restorePath = '/restore.gwbk'
        this.withCopyFilesToContainer([
            {
                source: path,
                target: '/restore.gwbk',
            },
        ])
        return this
    }

    public override async start(): Promise<StartedIgnitionContainer> {
        super.withWaitStrategy(Wait.forHealthCheck())
        super.withEnvironment(envToStringKeys(this.env))

        const exposedPorts = []
        const httpPort = this.getOrDefaultEnv('GATEWAY_HTTP_PORT')
        const httpsPort = this.getOrDefaultEnv('GATEWAY_HTTPS_PORT')
        if (httpPort) {
            exposedPorts.push(httpPort)
        }
        if (httpsPort) {
            exposedPorts.push(httpsPort)
        }
        super.withExposedPorts(...exposedPorts)

        if (this.runtime.name) {
            this.withCommand(['-n', this.runtime.name])
        }
        if (this.runtime.memoryMax) {
            this.withCommand(['-m', this.runtime.memoryMax.toString()])
        }
        if (this.runtime.restorePath) {
            this.withCommand(['-r', this.runtime.restorePath])
        }

        return new StartedIgnitionContainer(
            await super.start(),
            this.env,
            this.runtime
        )
    }
}

export class StartedIgnitionContainer extends AbstractStartedContainer {
    env: EnvironmentVariables = {}
    runtime: RuntimeArguments = {}

    constructor(
        startedTestContainer: StartedTestContainer,
        env: EnvironmentVariables,
        runtime: RuntimeArguments
    ) {
        super(startedTestContainer)
        this.env = env
        this.runtime = runtime
    }

    public getOrDefaultEnv<Key extends keyof EnvironmentVariables>(key: Key) {
        if (this.env[key]) {
            return this.env[key]
        } else if (DefaultEnvironmentVariables[key]) {
            return DefaultEnvironmentVariables[key]
        }
    }

    public getMappedHTTPPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.getOrDefaultEnv('GATEWAY_HTTP_PORT')!
        return this.getMappedPort(port)
    }

    public getMappedHTTPSPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.getOrDefaultEnv('GATEWAY_HTTPS_PORT')!
        return this.getMappedPort(port)
    }
}
