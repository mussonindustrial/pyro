import _ from 'lodash'

export function convertValuesToStringsDeep(obj: any) {
    return _.cloneDeepWith(obj, (value) => {
        return !_.isPlainObject(value) ? _.toString(value) : undefined
    })
}
