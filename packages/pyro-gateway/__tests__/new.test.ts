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
    gateway = await new IgnitionContainer('8.1.33')
    .withLogConsumer(stream => {
        stream.on("err", line => console.error(line));
        stream.on("end", () => console.log("Stream closed"));
    })
    .withModules(['perspective'])
    .withGatewayName(containerName)
    .start()

    gatewayClient = axios.create({
        baseURL: gateway.getRootURL(),
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

