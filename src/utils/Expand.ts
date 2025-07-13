// Helps simplify objects. See: https://stackoverflow.com/a/57683652
export type Expand<T> = T extends object
  ? {
      [K in keyof T]: Expand<T[K]>;
    }
  : T;
