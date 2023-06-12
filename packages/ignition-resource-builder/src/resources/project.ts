import perspective, { PerspectiveModule } from './perspective'

export type Project = {
    perspective: PerspectiveModule
}

const baseEmptyProject = {
    perspective,
}

export const emptyProject = Object.assign({}, baseEmptyProject)
