import { newModule } from '../../resources'
import { clientEventScripts } from './client-event-scripts'
import { clientTags } from './client-tags'
import { designerProperties } from './designer-properties'
import { generalProperties } from './general-properties'
import { launchProperties } from './launch-properties'
import { loginProperties } from './login-properties'
import { template } from './templates'
import { uiProperties } from './ui-properties'
import { window } from './windows'

export const vision = newModule('com.inductiveautomation.vision', {
    clientEventScripts,
    clientTags,
    designerProperties,
    generalProperties,
    launchProperties,
    loginProperties,
    template,
    uiProperties,
    window,
})
export default vision
