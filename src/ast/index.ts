export interface ASTNode<T, V> {
  type: T;
  value?: V;
  children: ASTNode<T, V>[];
}