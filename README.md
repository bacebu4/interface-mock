[![npm version](https://img.shields.io/npm/v/interface-mock)](https://www.npmjs.com/package/interface-mock)
![tests](https://github.com/bacebu4/interface-mock/actions/workflows/test.yaml/badge.svg?branch=master)

# Interface Mock

C#-like API for creating mock in TypeScript for Node.js environment

## Installation

```bash
npm install --save-dev interface-mock
```

or

```bash
yarn add --dev interface-mock
```

## Usage

Create mock by passing interface to it and providing default implementation, then call `.verify()` method to check whether the method was called. Additionally you can specify how many times it should have been called

```ts
import { createInterfaceMock } from 'interface-mock';

interface IBus {
  send: (message: string) => Promise<void>;
}

describe('SomeTest', () => {
  it('works', () => {
    const busMock = createInterfaceMock<IBus>({ send: async () => {} });
    const someService = new SomeService(busMock);

    someService.execute();

    busMock.verify(m => m.send('Hello'));
  });

  it('works 2', () => {
    const busMock = createInterfaceMock<IBus>({ send: async () => {} });
    const someService = new SomeService(busMock);

    someService.execute();

    busMock.verify(m => m.send('Hello'), { times: 2 });
  });
});
```

Additionally you can manually specify the resulting type of `createInterfaceMock` function:

```ts
import { createInterfaceMock, InterfaceMock } from 'interface-mock';

interface IBus {
  send: (message: string) => Promise<void>;
}

describe('SomeTest', () => {
  let busMock: InterfaceMock<IBus>;

  beforeEach(() => {
    busMock = createInterfaceMock<IBus>({ send: async () => {} });
  });

  it('works', () => {
    const someService = new SomeService(busMock);

    someService.execute();

    busMock.verify(m => m.send('Hello'));
  });
});
```

## Motivation

Without the library, the code above would look like this:

```ts
import { mock } from 'node:test';
import { assert } from 'node:assert';

interface IBus {
  send: (message: string) => Promise<void>;
}

describe('SomeTest', () => {
  it('works', () => {
    const busMock = { send: mock.fn(async () => ({})) };
    const someService = new SomeService(busMock);

    someService.execute();

    const args = busMock.mock.calls.at(0)?.arguments;
    assert.deepStrictEqual(args, ['Hello']);
    assert.strictEqual(busMock.mock.calls.length, 1);
  });
});
```

Additionally, using the approach above complicates the process of checking mock calls when they are made multiple times:

```ts
busMock.send('1');
busMock.send('2');
```

and then verifying that it was called once with specific arguments, which can be done more simply using the library:

```ts
busMock.verify(b => b.send('2'));
```

While this case is relatively rare, the main motivation for using this library is to improve the readability and simplicity of writing tests. By using the library, test code becomes more declarative and concise, allowing developers to focus on intent rather than boilerplate logic for call tracking.
