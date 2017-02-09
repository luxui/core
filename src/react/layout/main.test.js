jest.mock('../../lib/routing');
import routing from '../../lib/routing';

import React from 'react';
import renderer from 'react-test-renderer';

import registry from '../../lib/componentRegistry';

import './main';
const Collection = registry('Rest.Collection');
const ErrorComponent = registry('Error');
const Item = registry('Rest.Item');
const Main = registry('Main');

let response;

describe('Main (supplied Layout)', function () {
  afterEach(function () {
    registry('Rest.Collection', Collection);
    registry('Rest.Item', Item);
    registry('Error', ErrorComponent);
  });

  beforeEach(function () {
    spyOn(console, 'error');

    response = {
      data: {
        actions: [],
        class: ['collection'],
        entities: [],
        links: [
          {
            href: '/',
            rel: ['self'],
            title: 'Something Savvy',
          }
        ],
        properties: {},
        title: 'Testing Main Component',
      },
      error: false,
      path: '/home',
      status: 200,
    };
  });

  it('should exist; and should be a function', function () {
    expect(typeof Main).toBe('function');
  });

  it('should render a page from the `routing` module', function () {
    routing.mockImplementationOnce(function mock(path) {
      if (path === response.path) {

        return () => (<pre>{JSON.stringify(response, null, ' ')}</pre>);
      }

      throw new Error('Implementation fail.');
    });

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Rest.Collection component', function () {
    registry('Rest.Collection', () => (<pre>{JSON.stringify(response, null, ' ')}</pre>));

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Rest.Item component', function () {
    response.data.class = ['item'];

    registry('Rest.Item', () => (<pre>{JSON.stringify(response, null, ' ')}</pre>));

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Error component; when the response is an error', function () {
    response.error = new Error('API response error.');

    registry('Error', () => (<pre>{JSON.stringify(response, null, ' ')}</pre>));

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Error component; when the class type is not: collection or item', function () {
    response.data.class = ['something-else'];

    registry('Error', () => (<pre>{JSON.stringify(response, null, ' ')}</pre>));

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Error component; when the `class` property is absent', function () {
    delete response.data.class;

    registry('Error', () => (<pre>{JSON.stringify(response, null, ' ')}</pre>));

    const component = renderer.create(
      <Main {...response} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});