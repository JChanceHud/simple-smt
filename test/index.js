const SparseTree = require('..')

const tree = new SparseTree({ depth: 30 })
console.log(tree.root())

//   tree.insert('test')
// console.log(tree.root())
//   return
// for (let x = 0; x < 10; x++) {
//   console.log(x)
//   console.log(tree.root())
//   console.log(tree.tree)
//   tree.insert('test')
// }
// return
const start = +new Date()
const roots = {}

for (let x = 0; x < 100000; x++) {
  if (x !== 0 && x % 1000 === 0) {
    console.log(x)
    console.log(tree.root())
    if (roots[tree.root()]) {
      throw new Error('Duplicate root detected')
    }
    roots[tree.root()] = true
  }
  tree.insert('test')
}

const seconds = (+new Date() - start) / 1000
const recordsPerSecond = Math.floor(100000 / seconds)
console.log(`${recordsPerSecond} appends per second`)
