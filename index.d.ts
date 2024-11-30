export type InterfaceMock<T> = T & {
  verify: (cb: (mock: T) => unknown, props?: { times?: number }) => void;
};

export declare function createInterfaceMock<T extends object>(impl: T): InterfaceMock<T>;
