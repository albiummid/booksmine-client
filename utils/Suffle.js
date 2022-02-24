const shuffle = (array) => {
  const shuffledArray = array.sort(() => Math.random() - 0.5)
  return shuffledArray
}

export default shuffle
