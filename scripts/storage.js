export default function getStorage(key, initalValue) {
    const storageValue = JSON.parse(localStorage.getItem(key))

    if (!storageValue) {
        localStorage.setItem(key, JSON.stringify(initalValue))

        return initalValue
    } else {
        return storageValue
    }
}