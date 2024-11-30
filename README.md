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
