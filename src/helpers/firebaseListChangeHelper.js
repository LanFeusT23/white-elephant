import { toRef } from "vue"

export default function firebaseListChangeHelper(change, listRef) {
    const { newIndex, oldIndex, doc, type } = change

    if (type === "added") {
        listRef.value.splice(newIndex, 0, {
            id: doc.id,
            ...doc.data()
        })
    } else if (type === "modified") {
        listRef.value.splice(oldIndex, 1)
        listRef.value.splice(newIndex, 0, {
            id: doc.id,
            ...doc.data()
        })
    } else if (type === "removed") {
        listRef.value.splice(oldIndex, 1)
    }
}
