import { newModule, newFolderResource } from '../resources'

const alarmPipelines = newFolderResource<{ 'data.bin': any }>(
    'alarm-pipelines',
    { scope: 'G', version: 1 }
)

export const alarmNotification = newModule(
    'com.inductiveautomation.alarm-notification',
    {
        alarmPipelines,
    }
)
