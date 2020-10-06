export const SetValueLabel = (collection, value, label) => {
    return collection.map(m => {
        return {
            label: m[label],
            value: m[value]
        }
    })
}