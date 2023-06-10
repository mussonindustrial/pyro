import { IncompatibleResourceError } from './error'
import { Resource, ResourceType } from './resources'

export class Module {
    name: string
    allowedTypes: ResourceType[]
    resources: Resource[]

    constructor(name: string, allowedTypes: ResourceType[]) {
        this.name = name
        this.allowedTypes = allowedTypes
        this.resources = []
    }

    add(resource: Resource) {
        if (!this.allowedTypes.map((type) => type.key).includes(resource.key)) {
            throw new IncompatibleResourceError(`Resource ${resource.path} of type ${resource.key} cannot be added to module ${this.name}.
            Allowed resources types: ${this.allowedTypes}`)
        }
    }
}
