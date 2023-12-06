import { GenericContainer, Wait } from 'testcontainers'
import { convertValuesToStringsDeep } from './util'
import {
    DefaultEnvironmentVariables,
    EnvironmentVariables,
    GatewayEdition,
    GatewayNetwork,
    ModuleIdentifier,
    RuntimeArguments,
} from './types'
import { StartedIgnitionContainer } from './startedContainer'

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

    constructor(version: string) {
        super('inductiveautomation/ignition:' + version)
    }

    public withActivationToken(token: string) {
        this.env.IGNITION_ACTIVATION_TOKEN = token
        return this
    }

    public withAdminUsername(username: string) {
        this.env.GATEWAY_ADMIN_USERNAME = username
        return this
    }

    public withAdminPassword(password: string) {
        this.env.GATEWAY_ADMIN_PASSWORD = password
        return this
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

    public withGANPort(port: number) {
        this.env.GATEWAY_GAN_PORT = port
        return this
    }

    public withLicenseKey(key: string) {
        this.env.IGNITION_LICENSE_KEY = key
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
            this.runtime
        )
    }
}
