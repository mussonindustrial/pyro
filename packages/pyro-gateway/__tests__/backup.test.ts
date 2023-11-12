import { it, expect, beforeAll } from 'vitest'
import {
    IgnitionContainer,
    StartedIgnitionContainer
} from '../src'
import axios, { AxiosInstance } from 'axios';

let gateway: StartedIgnitionContainer | undefined = undefined
let gatewayClient: AxiosInstance | undefined = undefined

const containerName = 'pyro-gateway-test-restored'

beforeAll(async () => {
    gateway = await new IgnitionContainer('8.1.33')
    .withLogConsumer(stream => {
        stream.on("err", line => console.error(line));
        stream.on("end", () => console.log("Stream closed"));
    })
    .withModules(['perspective'])
    .withGatewayBackup('./__tests__/pyro-gateway-test-restored.gwbk')
    .start()

    const port = gateway.getMappedHTTPPort()

    gatewayClient = axios.create({
        baseURL: `http://localhost:${port}`,
        timeout: 1000
    });
}, 60000)

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
        console.log(data)
        expect(gatewayName[1]).toBe(containerName)
    })
})

