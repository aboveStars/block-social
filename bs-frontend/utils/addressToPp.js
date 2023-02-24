/** You give a word, and get numeric verison of it
 * @returns {number}
 */
export function addressToProfilePhoto(_address) {
    const sentence = _address.toString()
    let sum = 0

    for (let index = 0; index < sentence.length; index++) {
        const letter = sentence[index]
        const number = Number(letter.charCodeAt(0))
        sum += number
    }

    const photoCountInServer = 1000

    // I don't understand why but when I put "1" after photoCount... It throws out :(
    const scaledNumber = (sum % photoCountInServer) + 1

    const urlForImage = `${loremPicsumPrefix}${scaledNumber}/200`

    return urlForImage
}

const loremPicsumPrefix = "https://picsum.photos/id/"
