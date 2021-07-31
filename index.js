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
    // calculate the root
    this.buildTree()
  }

  root() {
    return this.tree[0][0]
  }

  insertMany(elements) {
    this.tree[this.depth - 1].push(...elements)
    this.buildTree()
  }

  insert(element) {
    this.tree[this.depth - 1].push(element)
    this.buildTree(this.tree[this.depth - 1].length - 1)
  }

  buildTree(fromIndex) {
    if (this.tree[this.depth - 1].length === 0) {
      this.tree[0] = [this.zeroTree[0]]
      return
    }
    if (fromIndex !== undefined) {
      // only rebuild a certain branch of the tree
      const startIndex = fromIndex % 2 === 0 ? fromIndex : fromIndex - 1
      for (let depth = this.depth - 1; depth > 0; depth--) {
        const currentIndex = Math.floor(startIndex / Math.pow(2, (this.depth - 1) - depth))
        const leftSiblingIndex = currentIndex % 2 === 0 ? currentIndex : currentIndex - 1
        const leftSibling = this.tree[depth].length <= leftSiblingIndex ? this.zeroTree[depth] : this.tree[depth][leftSiblingIndex]
        const rightSibling = this.tree[depth].length <= leftSiblingIndex + 1 ? this.zeroTree[depth] : this.tree[depth][leftSiblingIndex + 1]
        if (leftSibling === this.zeroTree[depth] && rightSibling === this.zeroTree[depth]) {
          throw new Error('Recalculating stale subtree')
        }
        const parent = this.hashFn(leftSibling, rightSibling)
        const parentIndex = Math.floor(startIndex / Math.pow(2, (this.depth - 1) - (depth - 1)))
        if (this.tree[depth - 1].length === parentIndex) {
          this.tree[depth - 1].push(parent)
        } else if (this.tree[depth - 1].length > parentIndex) {
          this.tree[depth - 1][parentIndex] = parent
        } else {
          throw new Error('Non-append operation')
        }
      }
      return
    }
    // otherwise build the whole tree
    for (let depth = this.depth - 1; depth > 0; depth--) {
      this.tree[depth - 1] = this.calcParents(this.tree[depth], depth)
    }
  }

  // where depth is between 0 and this.depth - 1
  calcParents(children, depth) {
    const parents = []
    for (let x = 0 ; x < children.length; x++) {
      // process the current element
      if (x % 2 === 1) {
        // it's a right element, move to the next left sibling
        continue
      }
      const leftSibling = children[x]
      const rightSibling = children.length <= x ? children[x+1] : this.zeroTree[depth]
      parents.push(this.hashFn(leftSibling, rightSibling))
    }
    return parents
  }
}

module.exports = SparseTree
