const SparseTree = require('..')

const tree = new SparseTree({ depth: 30 })
console.log(tree.root())

for (let x = 0; x < 100000; x++) {
  if (x % 1000 === 0) {
    console.log(x)
    console.log(tree.root())
  }
  tree.insert('test')
}
