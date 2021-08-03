const test = require('ava')
const assert = require('assert')
const SparseTree = require('..')

test('append speed', (t) => {
  const tree = new SparseTree({ depth: 30 })
  const start = +new Date()
  const roots = {}
  const count = 20000
  for (let x = 0; x < count; x++) {
    if (x !== 0 && x % 1000 === 0) {
      if (roots[tree.root()]) {
        throw new Error('Duplicate root detected')
      }
      roots[tree.root()] = true
    }
    tree.append('test')
  }
  const seconds = (+new Date() - start) / 1000
  const recordsPerSecond = Math.floor(count / seconds)
  console.log(`${recordsPerSecond} appends per second`)
  t.pass()
})

test('should merge subtree into larger tree', (t) => {
  const subtree = new SparseTree({ depth: 5 })
  for (let x = 0; x < 10; x++) {
    subtree.append('test')
  }
  const tree = new SparseTree({ depth: 20 })
  tree.appendTree(subtree)
  const root = tree.tree[tree.depth - subtree.depth][0]
  assert.equal(root, subtree.tree[0][0])
  t.pass()
})

test('should merge subtree into larger, part filled tree', (t) => {
  const subtree = new SparseTree({ depth: 5 })
  for (let x = 0; x < 10; x++) {
    subtree.append('test')
  }
  const tree = new SparseTree({ depth: 20 })
  for (let x = 0; x < 500; x++) {
    tree.append('test')
  }
  tree.appendTree(subtree)
  const root = tree.tree[tree.depth - subtree.depth].slice(-1)[0]
  assert.equal(root, subtree.root())
  t.pass()
})

test('should throw if invalid subtree appended', (t) => {
  const subtree = new SparseTree({ depth: 5 })
  for (let x = 0; x < 10; x++) {
    subtree.append('test')
  }
  const altsubtree = new SparseTree({ depth: 5 })
  for (let x = 0; x < 10; x++) {
    altsubtree.append('other test')
  }
  subtree.tree[0] = [...altsubtree.tree[0]]
  subtree.tree[1] = [...altsubtree.tree[1]]
  subtree.tree[2] = [...altsubtree.tree[2]]
  const tree = new SparseTree({ depth: 20 })
  try {
    tree.appendTree(subtree)
  } catch (err) {
    assert.equal(err.toString(), 'Error: Invalid subtree appended')
    t.pass()
    return
  }
  assert(false)
})

test('should test right subtree against left subtree', (t) => {
  const tree = new SparseTree({ depth: 10, rightToLeft: true })
  const entries = Array(2 ** 9).fill().map(() => 'test')
  tree.appendMany(entries)
  const subtree = tree.tree[5]
  const testTree = new SparseTree({ depth: 6 })
  testTree.appendMany(subtree)
  assert.equal(testTree.root(), tree.root())
  t.pass()
})
