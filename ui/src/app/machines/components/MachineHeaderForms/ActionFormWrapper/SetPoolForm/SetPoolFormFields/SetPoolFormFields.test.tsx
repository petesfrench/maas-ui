import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SetPoolForm from "../SetPoolForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SetPoolFormFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        selected: ["abc123", "def456"],
        statuses: {
          abc123: machineStatusFactory({ settingPool: false }),
          def456: machineStatusFactory({ settingPool: false }),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({ id: 0, name: "default" }),
          resourcePoolFactory({ id: 1, name: "pool-1" }),
        ],
      }),
    });
  });

  it("shows a select if select pool radio chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      wrapper.find("[data-test='select-pool'] input").simulate("change", {
        target: { name: "poolSelection", value: "select" },
      });
    });
    wrapper.update();
    expect(wrapper.find("Select").exists()).toBe(true);
  });

  it("shows inputs for creating a pool if create pool radio chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetPoolForm clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      wrapper.find("[data-test='create-pool'] input").simulate("change", {
        target: { name: "poolSelection", value: "create" },
      });
    });
    wrapper.update();
    expect(wrapper.find("Input[name='name']").exists()).toBe(true);
    expect(wrapper.find("Input[name='description']").exists()).toBe(true);
  });
});
