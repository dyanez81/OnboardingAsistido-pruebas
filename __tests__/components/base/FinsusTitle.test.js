import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import FisnusTitle from 'components/base/FinsusTitle';

describe('Testing FinsusTitle component', () => {
  it('render component', () => {
    const wrapper = shallow(<FisnusTitle title={'Mi titulo'} />);

    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({title: 'Otro titulo'});
    expect(wrapper).toMatchSnapshot();
  });
});
