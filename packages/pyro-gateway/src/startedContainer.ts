import { AbstractStartedContainer, StartedTestContainer } from 'testcontainers'
import { EnvironmentVariables, RuntimeArguments } from './types'

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

    public getMappedHTTPPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.env.GATEWAY_HTTP_PORT!
        return this.getMappedPort(port)
    }

    public getMappedHTTPSPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.env.GATEWAY_HTTPS_PORT!
        return this.getMappedPort(port)
    }

    public getMappedGANPort(): number | undefined {
        const port = this.env.GATEWAY_GAN_PORT
        if (port) {
            return this.getMappedPort(port)
        }
    }

    public getRootURL(): string {
        const port = this.getMappedHTTPPort()
        return `http://localhost:${port}`
    }

    public getImagesURL(): string {
        return `${this.getRootURL()}/system/images`
    }

    public getInfoURL(): string {
        return `${this.getRootURL()}/system/gwinfo`
    }

    public getPerspectiveClientURL(project: string): string {
        return `${this.getRootURL()}/data/perspective/client/${project}`
    }

    public getStatusURL(): string {
        return `${this.getRootURL()}/StatusPing`
    }

    public getWebdevURL(project: string): string {
        return `${this.getRootURL()}/system/webdev/${project}`
    }
}
