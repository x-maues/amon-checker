/**
 * Picks a random item from an array
 * @param {Array} array - The array to pick from
 * @returns {*} A random item from the array
 */
export function pickRandomItem(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot pick from empty array')
  }
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffles an array in place
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Gets a random subset of items from an array
 * @param {Array} array - The array to pick from
 * @param {number} count - Number of items to pick
 * @returns {Array} Random subset of items
 */
export function getRandomSubset(array, count) {
  if (!array || array.length === 0) {
    throw new Error('Cannot pick from empty array')
  }
  if (count >= array.length) {
    return shuffleArray([...array])
  }
  return shuffleArray([...array]).slice(0, count)
} 