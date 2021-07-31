type HashFn<T> = (item: T, item2?: T) => T

declare module 'simple-smt' {
  export default class SparseTree<T> {
    depth: number
    tree: T[][]
    zeroTree: T[]
    constructor(config: { depth: number, hashFn?: HashFn<T>, items: T[] })
    root(): T
    appendMany(items: T[]): void
    append(item: T): void
    appendTree(subtree: SparseTree<T>): void
    buildTree(fromIndex?: number): void
  }
}
