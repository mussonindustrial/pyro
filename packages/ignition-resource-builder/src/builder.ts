import { Module } from './module'
import {
    PerspectiveGeneral,
    PerspectivePageConfig,
    PerspectiveSessionProps,
    PerspectiveSessionScript,
    PerspectiveStyleClass,
    PerspectiveView,
} from './resources'

class ProjectResourceBuilder {
    perspective = new Module('perspective', [
        PerspectiveGeneral,
        PerspectivePageConfig,
        PerspectiveSessionProps,
        PerspectiveSessionScript,
        PerspectiveStyleClass,
        PerspectiveView,
    ])
}

// createBuilder supplies a new builder.
export function createBuilder() {
    return new ProjectResourceBuilder()
}
