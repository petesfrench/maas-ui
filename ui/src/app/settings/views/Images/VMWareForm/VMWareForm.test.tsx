import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMWareForm from "./VMWareForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMWareForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: "vcenter_server",
            value: "my server",
          },
          {
            name: "vcenter_username",
            value: "admin",
          },
          {
            name: "vcenter_password",
            value: "passwd",
          },
          {
            name: "vcenter_datacenter",
            value: "my datacenter",
          },
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets vcenter_server value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(wrapper.find("input[name='vcenter_server']").props().value).toBe(
      "my server"
    );
  });

  it("sets vcenter_username value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(wrapper.find("input[name='vcenter_username']").props().value).toBe(
      "admin"
    );
  });

  it("sets vcenter_password value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(wrapper.find("input[name='vcenter_password']").props().value).toBe(
      "passwd"
    );
  });

  it("sets vcenter_datacenter value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(wrapper.find("input[name='vcenter_datacenter']").props().value).toBe(
      "my datacenter"
    );
  });
});
