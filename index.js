const { sha512_256 } = require('js-sha512')

const defaultHashFn = (item, item2) => {
  const hasher = sha512_256.create()
  hasher.update(item)
  if (item2) {
    hasher.update(item2)
  }
  return hasher.hex()
}

class SparseTree {
  constructor({ depth, hashFn, items }) {
    this.depth = depth
    this.hashFn = hashFn || defaultHashFn
    this.tree = Array(depth).fill().map(() => [])
    // indexed from top to bottom
    this.zeroTree = Array(depth).fill()
    // calculate zero entries
    for (let x = depth; x > 0; x--) {
      if (x === depth) {
        // start from base
        this.zeroTree[x - 1] = this.hashFn('')
      } else {
        // otherwise generate the parent
        this.zeroTree[x - 1] = this.hashFn(
          this.zeroTree[x],
          this.zeroTree[x]
        )
      }
    }
    if (items) {
      this.tree[depth - 1].push(...items)
    }
    console.log('building tree')
    // calculate the root
    this.buildTree()
  }

  root() {
    return this.tree[0][0]
  }

  insert(element) {
    this.tree[this.depth - 1].push(element)
    this.buildTree()
  }

  buildTree() {
    if (this.tree[this.depth - 1].length === 0) {
      this.tree[0] = [this.zeroTree[0]]
      return
    }
    for (let depth = this.depth - 1; depth > 0; depth--) {
      this.tree[depth - 1] = this.calcParents(this.tree[depth], depth)
    }
  }

  // where depth is between 0 and this.depth
  calcParents(children, depth) {
    const parents = []
    for (let x = 0 ; x < children.length; x++) {
      // process the current element
      if (x % 2 === 1) {
        // it's a right element, move to the next left sibling
        continue
      }
      const leftSibling = children[x]
      const rightSibling = children.length > x + 1 ? children[x+1] : ''
      parents.push(this.hashFn(leftSibling, rightSibling))
    }
    return parents
  }
}

module.exports = SparseTree
