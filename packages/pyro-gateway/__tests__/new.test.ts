import { it, expect, beforeAll } from 'vitest'
import {
    IgnitionContainer,
    StartedIgnitionContainer
} from '../src'
import axios, { AxiosInstance } from 'axios';

let gateway: StartedIgnitionContainer | undefined = undefined
let gatewayClient: AxiosInstance | undefined = undefined

const containerName = 'pyro-gateway-test'

beforeAll(async () => {
    gateway = await new IgnitionContainer('inductiveautomation/ignition:8.1.33')
    .withLogConsumer(stream => {
        stream.on("err", line => console.error(line));
        stream.on("end", () => console.log("Stream closed"));
    })
    .withModules(['perspective'])
    .withGatewayName(containerName)
    .start()

    gatewayClient = axios.create({
        baseURL: gateway.getUrl(),
        timeout: 1000
    });
}, 120000)

it('should respond to status ping', async () => { 
    await gatewayClient?.get('/StatusPing')
    .then(function (response) {
        expect(response.data.state).toBe('RUNNING')
    })
})

it('should set the gateway name', async () => { 
    await gatewayClient?.get('/system/gwinfo')
    .then(function (response) {
        const data = response.data.toString()
        const gatewayName = data.match(/PlatformName=([^;]+);/)
        expect(gatewayName[1]).toBe(containerName)
    })
})

function delay(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

it('should perform a project import', async () => {
    await gateway.importProject('import-test', './__tests__/project-import.zip')
    // await gateway?.copyFilesToContainer([{
    //     source: './__tests__/project-import.zip',
    //     target: gateway.getPath('/data', '/project-import.zip')
    // }])

    await delay(120000)
    expect(1, 'message').toBe(1)

}, 120000)

it('should return expected install paths', async () => {
    expect(gateway?.getPath('/data')).toBe('/usr/local/bin/ignition/data')
})