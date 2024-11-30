import { describe, it } from 'node:test';
import { createInterfaceMock } from '../index.js';
import assert from 'assert';

describe('Test', () => {
  it('successfully verifies that function was called', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo();

    mock.verify(m => m.foo());
  });

  it('successfully verifies that function was called several times', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo();
    mock.foo();

    mock.verify(m => m.foo());
  });

  it('successfully verifies that function was called specified times', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo();
    mock.foo();

    mock.verify(m => m.foo(), { times: 2 });
  });

  it('successfully verifies that function was called with expected arguments', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo({ baz: 12 });

    mock.verify(m => m.foo({ baz: 12 }));
  });

  it('throws when function was not called', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    let e;
    try {
      mock.verify(m => m.foo());
    } catch (error) {
      e = error;
    }

    assert(e instanceof Error);
  });

  it('throws when function was not called specified times', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo();

    let e;
    try {
      mock.verify(m => m.foo(), { times: 2 });
    } catch (error) {
      e = error;
    }

    assert(e instanceof Error);
  });

  it('throws when function was not called with specified arguments', () => {
    const mock = createInterfaceMock({ foo: () => 'bar' });

    mock.foo({ baz: 13 });

    let e;
    try {
      mock.verify(m => m.foo({ baz: 12 }));
    } catch (error) {
      e = error;
    }

    assert(e instanceof Error);
  });
});
