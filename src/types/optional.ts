/**
 * Optional type alias: T or null.
 */
export type Optional<T> = T | null;

/**
 * Example usage of Optional<T> to demonstrate its intended pattern.
 *
 * This can be used as a reference for fields that are explicitly nullable
 * (i.e. can be T or null, but not undefined).
 */
export interface OptionalExample<T> {
  value: Optional<T>;
}
