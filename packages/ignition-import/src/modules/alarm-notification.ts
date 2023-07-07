import { newModule, newFolderResource } from '../resources'

const alarmPipelines = newFolderResource('alarm-pipelines', {
    data: 'data.bin',
})

export const alarmNotification = newModule(
    'com.inductiveautomation.alarm-notification',
    {
        alarmPipelines,
    }
)
