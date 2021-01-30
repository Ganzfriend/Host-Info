/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/**
 * @test-environment jsdom
 */
import 'jsdom-global/register';
import React from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import {
  shallow, configure, mount, render,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../Client/components/app.jsx';
import Location from '../Client/components/Location.jsx';
import HostInfo from '../Client/components/HostInfo.jsx';
import ToKnow from '../Client/components/ToKnow.jsx';
import { hosts, toKnow, locations } from './fakeData.js';
import Rules from '../Client/components/Rules.jsx';
import Health from '../Client/components/Health.jsx';

configure({ adapter: new Adapter() });

jest.mock('axios');

const getData = () => Promise.all([
  (axios.get.mockResolvedValue({ data: locations }))(),
  (axios.get.mockResolvedValue({ data: hosts }))(),
  (axios.get.mockResolvedValue({ data: toKnow }))(),
]);

let wrapper;

describe('Basic app functionality', () => {
  it('should render', (done) => {
    wrapper = shallow(<App getData={getData} />);
    expect(wrapper.exists()).toBeTruthy();
    done();
  });

  it('should have an inital state', (done) => {
    wrapper = shallow(<App getData={getData} />);
    expect(wrapper.state()).toEqual(expect.any(Object));

    expect(wrapper.state().location).toMatchObject({});
    expect(wrapper.state().HostInfo).toMatchObject({});
    expect(wrapper.state().ToKnow).toMatchObject({});
    done();
  });

  it('should have child components ready to be rendered', (done) => {
    wrapper = shallow(<App getData={getData} />);
    expect(wrapper.find('Location')).toHaveLength(1);
    expect(wrapper.find('HostInfo')).toHaveLength(1);
    expect(wrapper.find('ToKnow')).toHaveLength(1);
    done();
  });

  describe('App mounting functionality', () => {
    let instance;
    let location;
    let hostInfo;
    let toknow;

    beforeEach(async (done) => {
      wrapper = shallow(<App getData={getData} />);
      instance = wrapper.instance();

      jest.spyOn(instance, 'componentDidMount');
      instance.componentDidMount();

      await new Promise(setImmediate);
      done();
    });

    // it('should call componentDidMount and update the state', (done) => {
    //   expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    //   location = instance.state.location;
    //   hostInfo = instance.state.HostInfo;
    //   toknow = instance.state.ToKnow;

    //   expect(location).toMatchObject(locations);
    //   expect(hostInfo).toMatchObject(hosts);
    //   expect(toknow).toMatchObject(toKnow);
    //   done();
    // });

    it('should not pass down props to Location component', (done) => {
      expect(wrapper.find('Location').props()).toEqual({});
      done();
    });

    it('should not pass down props to HostInfo component', (done) => {
      expect(wrapper.find('HostInfo').props()).toEqual({});
      done();
    });

    it('should not pass down props to ToKnow component', (done) => {
      expect(wrapper.find('ToKnow').props()).toEqual({});
      done();
    });
  });
});

describe('Location component functionality', () => {
  const app = render(<App getData={getData} />);
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
      house: 'Modal-H-is-for-house',
    }),
    useRouteMatch: () => ({ url: '/listing/Model-H-is-for-house' }),
  }));

  it('should only show a preview of the location', (done) => {
    expect(app.find('#desc-prev').text().length).toBeLessThan(locations.desc.length);
    done();
  });

  it('should show not the Map Modal on load in', (done) => {
    expect(app.find(Modal).length).toBe(0);
    done();
  });

  it('should show the Map Modal when More about location is clicked', (done) => {
    console.log(app.find('#open-loc-modal'));
    expect(app.find(Modal).prop('show')).toBe(true);
    done();
  });

  it('should show a detailed description about the city and areas when more about is clicked', (done) => {
    const locComp = shallow(<Location location={locations} />);
    locComp.find('#open-loc-modal').simulate('click');
    expect(locComp.find('#loc-desc').children().length).toBeGreaterThan(1);
    done();
  });
});

const e = {
  preventDefault: () => {},
  stopPropagation: () => {},
};

describe('HostInfo component functionality', () => {
  const hostComp = shallow(<HostInfo host={hosts} />);
  // const setState = jest.fn();
  // const useStateSpy = jest.spyOn(React, 'useState');
  // useStateSpy.mockImplementation((init) => [init, setState]);

  it('should only show only a preview of the host description', (done) => {
    expect(hostComp.find('#host-desc').text().length).toBeLessThan(hosts.desc.length);
    done();
  });

  it('should show the full host description when read more is clicked', (done) => {
    hostComp.find('a').props().onClick(e);
    expect(hostComp.find('#host-desc').text()).toBe(hosts.desc);
    done();
  });

  describe('Contact host modal', () => {
    it('should have a Modal ready to render onto the page', (done) => {
      expect(hostComp.find(Modal).length).toBe(1);
      done();
    });

    it('should not show the modal if contact host hasn\'t been clicked', (done) => {
      expect(hostComp.find(Modal).prop('show')).toBe(false);
      done();
    });

    it('should show the modal once contact host is clicked', (done) => {
      hostComp.find('button').simulate('click');
      expect(hostComp.find(Modal).prop('show')).toBe(true);
      done();
    });

    it('should close the modal when close is clicked', (done) => {
      expect(hostComp.find(Modal).prop('show')).toBe(true);
      hostComp.find(Button).last().simulate('click');
      expect(hostComp.find(Modal).prop('show')).toBe(false);
      done();
    });

    it('should not close the modal when submit is clicked and forms aren\'t validated', (done) => {
      e.currentTarget = {
        checkValidity: () => false,
      };
      hostComp.find('button').simulate('click');
      expect(hostComp.find(Modal).prop('show')).toBe(true);
      hostComp.find(Form).props().onSubmit(e);
      expect(hostComp.find(Modal).prop('show')).toBe(true);
      done();
    });

    it('should close the modal when submit is clicked and forms are correct', async (done) => {
      e.currentTarget = {
        checkValidity: () => true,
      };
      axios.put.mockResolvedValue('');
      hostComp.find(Form).props().onSubmit(e);
      await new Promise(setImmediate);
      expect(hostComp.find(Modal).prop('show')).toBe(false);
      done();
    });
  });
});

describe('To Know component functionality', () => {
  const knowComp = shallow(<ToKnow toKnow={toKnow} />);

  it('should render 3 sections of things renter to know', (done) => {
    expect(knowComp.find('#toKnow-grid').children().length).toBe(3);
    done();
  });

  it('should render a component for the Rules section', (done) => {
    expect(knowComp.find(Rules).length).toBe(1);
    expect(knowComp.find(Rules).prop('rules')).toBe(toKnow.rules.house);
    done();
  });

  it('should render a component for the Health/Safety section', (done) => {
    expect(knowComp.find(Health).length).toBe(1);
    expect(knowComp.find(Health).prop('health')).toBe(toKnow.health.safety);
    done();
  });

  describe('Rules module', () => {
    const RulesComp = shallow(<Rules rules={toKnow.rules.house} />);

    it('should return then same number of child components of rules', (done) => {
      expect(RulesComp.children().length).toBe(toKnow.rules.house.length);
      done();
    });

    it('should render an icon and text for each rule', (done) => {
      const firstChild = RulesComp.children().first().children();
      expect(firstChild.length).toBe(2);
      expect(firstChild.last().text()).toBe(toKnow.rules.house[0]);
      done();
    });
  });

  describe('Health module', () => {
    const HealthComp = shallow(<Health health={toKnow.health.safety} />);

    it('should return then same number of child components of safety points', (done) => {
      expect(HealthComp.children().length).toBe(toKnow.health.safety.length);
      done();
    });

    it('should render an icon and text for each rule', (done) => {
      const firstChild = HealthComp.children().first().children();
      expect(firstChild.length).toBe(2);
      expect(firstChild.last().text()).toBe(toKnow.health.safety[0]);
      done();
    });
  });

  describe('Modal functionality for ToKnow Module', () => {
    // TODO
  });
});
