const shuffle = (array, limit) => {
  const shuffledArray = limit
    ? array.sort(() => Math.random() - 0.5).slice(0, limit)
    : array.sort(() => Math.random() - 0.5)
  return shuffledArray
}

export default shuffle
