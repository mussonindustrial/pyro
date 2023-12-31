import { AbstractStartedContainer, StartedTestContainer } from 'testcontainers'
import fs from 'fs'
import JSZip from 'jszip'
import {
    EnvironmentVariables,
    RuntimeArguments,
    GATEWAY_PATH,
    GatewayPath,
    CustomArguments,
} from './types'
import { ContentToCopy, FileToCopy } from 'testcontainers/build/types'

export class StartedIgnitionContainer extends AbstractStartedContainer {
    env: EnvironmentVariables
    runtime: RuntimeArguments
    custom: CustomArguments

    constructor(
        startedTestContainer: StartedTestContainer,
        env: EnvironmentVariables,
        runtime: RuntimeArguments,
        custom: CustomArguments
    ) {
        super(startedTestContainer)
        this.env = env
        this.runtime = runtime
        this.custom = custom
    }

    /**
     * Get the mapped HTTP port.
     * This port is used with accessing the gateway from outside the container.
     * @returns
     */
    public getHttpPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.env.GATEWAY_HTTP_PORT!
        return this.getMappedPort(port)
    }

    /**
     * Get the mapped HTTPS port.
     * This port is used with accessing the gateway from outside the container.
     * @returns
     */
    public getHttpsPort(): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const port = this.env.GATEWAY_HTTPS_PORT!
        return this.getMappedPort(port)
    }

    /**
     * Get the  mapped GAN port.
     * This port is used with accessing the gateway from outside the container.
     * @returns
     */
    public getGanPort(): number | undefined {
        const port = this.env.GATEWAY_GAN_PORT
        if (port) {
            return this.getMappedPort(port)
        }
    }

    /**
     * Get the root URL.
     * @returns
     */
    public getUrl(): string {
        const port = this.getHttpPort()
        return `http://localhost:${port}`
    }

    /**
     * Get the images URL.
     * @returns
     */
    public getImagesUrl(): string {
        return `${this.getUrl()}/system/images`
    }

    /**
     * Get the gateway info URL.
     * @returns
     */
    public getInfoUrl(): string {
        return `${this.getUrl()}/system/gwinfo`
    }

    /**
     * Get a Perspective URL.
     * @param project project name
     * @param paths additional url paths
     * @returns
     */
    public getPerspectiveUrl(project: string, ...paths: string[]): string {
        let uri = `${this.getUrl()}/data/perspective/client/${project}`
        if (paths.length > 0) {
            uri += '/' + paths.join('/')
        }
        return uri
    }

    /**
     * Get the status URL.
     * @returns
     */
    public getStatusUrl(): string {
        return `${this.getUrl()}/StatusPing`
    }

    /**
     * Get a WebDev URL.
     * @param project project name
     * @param paths additional url paths
     * @returns
     */
    public getWebdevUrl(project: string, ...paths: string[]): string {
        let uri = `${this.getUrl()}/system/webdev/${project}`
        if (paths.length > 0) {
            uri += '/' + paths.join('/')
        }
        return uri
    }

    /**
     * Get the installation path of Ignition within the container.
     * @returns
     */
    public getInstallPath(): string {
        return this.custom.installPath
    }

    public getPath(root: GatewayPath, ...paths: string[]): string {
        let p = this.getInstallPath()
        p += '/' + root
        p += '/' + paths.join('/')
        return p
    }

    /**
     * Imports a project into the gateway. NOTE: This will overwrite any existing project/resource files on the gateway.
     * @param project project name
     * @param path path to project import .zip
     */
    public async importProject(project: string, path: string): Promise<void> {
        const f = fs.readFileSync(path)
        const toCopy: ContentToCopy[] = []
        await JSZip.loadAsync(f).then((zip) => {
            zip.forEach(async (relativePath, zipEntry) => {
                const content = Buffer.from(await zipEntry.async('arraybuffer'))
                const target = this.getPath(
                    GATEWAY_PATH.PROJECTS,
                    project,
                    relativePath
                )
                toCopy.push({
                    content,
                    target,
                })
            })
        })
        await this.copyContentToContainer(toCopy)
    }

    /**
     * Imports project resources into the gateway. NOTE: This will overwrite any existing resource files on the gateway.
     * @param project project name
     * @param path path to project resource .zip
     */
    public async importProjectResources(
        project: string,
        path: string
    ): Promise<void> {
        const f = fs.readFileSync(path)
        const toCopy: ContentToCopy[] = []
        await JSZip.loadAsync(f).then((zip) => {
            zip.forEach(async (relativePath, zipEntry) => {
                const content = Buffer.from(await zipEntry.async('arraybuffer'))

                const target = this.getPath(
                    GATEWAY_PATH.PROJECTS,
                    project,
                    relativePath
                )

                if (zipEntry.name !== 'project.json') {
                    toCopy.push({
                        content,
                        target,
                    })
                }
            })
        })
        await this.copyContentToContainer(toCopy)
    }

    private async copyFilesToGateway(
        folder: GatewayPath,
        source: string,
        name?: string
    ): Promise<void> {
        if (name === undefined) {
            name = source.split('/').pop()
        }

        const target = folder + '/' + name
        return this.copyFilesToContainer([
            {
                source,
                target,
            },
        ])
    }

    private async copyDirectoryToGateway(
        folder: GatewayPath,
        source: string,
        name?: string
    ): Promise<void> {
        if (name === undefined) {
            name = source.split('/').pop()
        }

        const target = folder + '/' + name
        return this.copyDirectoriesToContainer([
            {
                source,
                target,
            },
        ])
    }

    public async copyThemeFileToContainer(
        source: string,
        name?: string
    ): Promise<void> {
        return this.copyFilesToGateway(
            this.getPath(GATEWAY_PATH.PERSPECTIVE_THEMES),
            source,
            name
        )
    }

    public async copyThemeDirectoryToContainer(
        source: string,
        name?: string
    ): Promise<void> {
        return this.copyDirectoryToGateway(
            this.getPath(GATEWAY_PATH.PERSPECTIVE_THEMES),
            source,
            name
        )
    }

    public async copyFontFileToContainer(
        source: string,
        name?: string
    ): Promise<void> {
        return this.copyFilesToGateway(
            this.getPath(GATEWAY_PATH.PERSPECTIVE_FONTS),
            source,
            name
        )
    }

    public async copyFontDirectoryToContainer(
        source: string,
        name?: string
    ): Promise<void> {
        return this.copyDirectoryToGateway(
            this.getPath(GATEWAY_PATH.PERSPECTIVE_FONTS),
            source,
            name
        )
    }

    public async copyProjectToContainer(
        source: string,
        name?: string
    ): Promise<void> {
        return this.copyDirectoryToGateway(GATEWAY_PATH.PROJECTS, source, name)
    }
}
