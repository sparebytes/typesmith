export interface BTree<T> {
  value: T;
  left?: BTree<T> | null;
  right?: BTree<T> | null;
}
