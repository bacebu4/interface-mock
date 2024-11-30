export declare function createInterfaceMock<T extends object>(
  impl: T,
): T & { verify: (cb: (mock: T) => unknown, props?: { times?: number }) => void };
