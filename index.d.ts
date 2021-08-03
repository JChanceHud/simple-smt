type HashFn<T> = (item: T, item2: T) => T
type PreHashFn<T> = (hashFn: HashFn<T>, depth: number, childValue?: T) => T

declare module 'simple-smt' {
  export default class SparseTree<T> {
    depth: number
    tree: T[][]
    zeroTree: T[]
    constructor(config: {
      depth: number,
      hashFn?: HashFn<T>,
      preHashFn?: PreHashFn<T>,
      items: T[]
    })
    root(): T
    appendMany(items: T[]): void
    append(item: T): void
    appendTree(subtree: SparseTree<T>): void
    buildTree(fromIndex?: number): void
  }
}
