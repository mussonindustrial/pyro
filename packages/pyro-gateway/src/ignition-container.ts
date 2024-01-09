import { GenericContainer, Wait } from 'testcontainers'
import { convertValuesToStringsDeep } from './util'
import {
    CustomArguments,
    DefaultCustomArguments,
    DefaultEnvironmentVariables,
    EnvironmentVariables,
    GatewayEdition,
    GatewayNetwork,
    ModuleIdentifier,
    RuntimeArguments,
} from './types'
import { StartedIgnitionContainer } from './ignition-container-started'

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
    env: EnvironmentVariables = { ...DefaultEnvironmentVariables }
    runtime: RuntimeArguments = {}
    custom: CustomArguments = { ...DefaultCustomArguments }

    constructor(image = 'inductiveautomation/ignition:latest') {
        super(image)
    }

    public withActivationToken(token: string): this {
        this.env.IGNITION_ACTIVATION_TOKEN = token
        return this
    }

    public withAdminUsername(username: string): this {
        this.env.GATEWAY_ADMIN_USERNAME = username
        return this
    }

    public withAdminPassword(password: string): this {
        this.env.GATEWAY_ADMIN_PASSWORD = password
        return this
    }

    public withDebugMode(debugMode: boolean): this {
        this.runtime.debugMode = debugMode
        return this
    }

    public withEdition(edition: GatewayEdition): this {
        this.env.IGNITION_EDITION = edition
        return this
    }

    public withGanPort(port: number): this {
        this.env.GATEWAY_GAN_PORT = port
        return this
    }

    public withGatewayBackup(path: string, restoreDisabled = false): this {
        this.runtime.restorePath = '/restore.gwbk'
        this.withCopyFilesToContainer([
            {
                source: path,
                target: '/restore.gwbk',
            },
        ])

        this.env.GATEWAY_RESTORE_DISABLED = restoreDisabled
        return this
    }

    public withGatewayName(name: string): this {
        this.runtime.name = name
        return this
    }

    public withGid(gid: number): this {
        this.env.IGNITION_GID = gid
        return this
    }

    public withHttpPort(port: number): this {
        this.env.GATEWAY_HTTP_PORT = port
        return this
    }

    public withHttpsPort(port: number): this {
        this.env.GATEWAY_HTTPS_PORT = port
        return this
    }

    public withInstallPath(installPath: string): this {
        this.custom.installPath = installPath
        return this
    }

    public withLicenseKey(key: string): this {
        this.env.IGNITION_LICENSE_KEY = key
        return this
    }

    public withModules(modules: ModuleIdentifier[]): this {
        this.env.GATEWAY_MODULES_ENABLED = modules
        return this
    }

    public withMaxMemory(memoryMax: number): this {
        this.runtime.memoryMax = memoryMax
        return this
    }

    public withQuickStart(quickStart: boolean): this {
        this.env.DISABLE_QUICKSTART = !quickStart
        return this
    }

    public withTimezone(timezone: string): this {
        this.env.TZ = timezone
        return this
    }

    public withUid(uid: number): this {
        this.env.IGNITION_UID = uid
        return this
    }

    public override async start(): Promise<StartedIgnitionContainer> {
        super.withWaitStrategy(Wait.forHealthCheck())
        super.withEnvironment(envToStringKeys(this.env))

        const exposedPorts = []
        const httpPort = this.env.GATEWAY_HTTP_PORT
        const httpsPort = this.env.GATEWAY_HTTPS_PORT
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
            this.runtime,
            this.custom
        )
    }
}
