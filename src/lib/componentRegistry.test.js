import registry from './componentRegistry';

describe('componentRegistry', function () {
  it('should exist; and should be a function', function () {
    expect(typeof registry).toMatch(/function/i);
  });

  it('should store a component', function () {
    const key = 'myApp.component';
    const random = Math.random().toString().slice(2);

    registry(key, () => random);
    const tempComponent = registry(key);

    expect(tempComponent()).toBe(random);
  });

  it('should throw an error if no component identifier is not a string', function () {
    expect(function () {
      registry(1234);
    }).toThrow(new Error('Component identifiers are required and must be strings.'));
  });

  it('should throw an error if ReactJS component is not a function', function () {
    expect(function () {
      registry('', 1234);
    }).toThrow(new Error('React components must be functions.'));
  });

  it('should overwrite an existing component by default', function () {
    registry('Hello', () => 'Goodbye');
    registry('Hello', () => 'Hello');

    expect(registry('Hello')()).toBe('Hello');
  });

  it('should NOT overwrite an existing component when indicating not to', function () {
    registry('Hello', () => 'Hello');
    registry('Hello', () => 'Goodbye', false);

    expect(registry('Hello')()).toBe('Hello');
  });

  it('should throw an error if too many arguments are provided', function () {
    expect(function () {
      registry('', () => {}, true, 234);
    }).toThrow(new Error('Too many arguments provided to componentRegistry.'));
  });
});