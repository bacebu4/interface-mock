import util from 'node:util';

function createProxy(impl) {
  const calls = [];

  const proxy = new Proxy(impl, {
    get: function (target, prop, receiver) {
      const result = Reflect.get(target, prop, receiver);
      if (typeof result === 'function' && typeof prop === 'string') {
        const funcProxy = new Proxy(result, {
          apply: function (target, thisArg, argumentsList) {
            calls.push([prop, argumentsList]);
            return target(...argumentsList);
          },
        });
        return funcProxy;
      }
      return result;
    },
  });

  return { calls, proxy };
}

export function createInterfaceMock(impl) {
  const { proxy, calls } = createProxy(impl);

  proxy.verify = (cb, { times } = {}) => {
    const { proxy: mockProxy, calls: mockCalls } = createProxy(impl);

    cb(mockProxy);

    if (mockCalls.length > 1) {
      throw new Error('Unsupported more than one verify');
    }

    const mockCall = mockCalls.at(0);

    if (!mockCall) {
      throw new Error('No calls within verify');
    }

    const [mockCallName, mockCallArguments] = mockCall;

    const originalArguments = calls.filter(c => c[0] === mockCallName).map(c => c[1]);

    const equalArguments = originalArguments.filter(a =>
      util.isDeepStrictEqual(a, mockCallArguments),
    );

    if (times !== undefined) {
      if (times !== equalArguments.length) {
        throw new Error(
          `Unmatched calls to .${mockCallName}(), expected calls: ${times}, made calls: ${equalArguments.length}`,
        );
      }
      return;
    }

    if (equalArguments.length) {
      return;
    }

    throw new Error(`Unmatched calls to .${mockCallName}()`);
  };

  return proxy;
}
