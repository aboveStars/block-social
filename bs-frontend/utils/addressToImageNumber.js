/** You give a word, and get numeric verison of it
 * @returns {number}
 */
export async function addressToNumbers(_address) {
    const sentence = _address.toString()
    let sum = 0

    for (let index = 0; index < sentence.length; index++) {
        const letter = sentence[index]
        const number = Number(letter.charCodeAt(0))
        sum += number
    }

    return sum
}

/** Url template for randomImage
 * Dont't forget add pixel sizes (200)
 * Don't forget add randomId number (237)
 * Result should be like : https://picsum.photos/id/237/200
 */
export const loremPicsumPrefix = "https://picsum.photos/id/"
