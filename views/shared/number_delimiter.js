function number_delimiter(num) {
  let num_str = String(num)
  let index = num_str.length
  let count = 0
  for (let i = num_str.length; i > 0; i--) {
    count += 1
    index -= 1
    if (count == 3 && index != 0) {
      num_str = num_str.substring(0, index) + ',' + num_str.substring(index)
      console.log(num_str)
      count = 0
    }
  }
  return num_str
}

export default number_delimiter;