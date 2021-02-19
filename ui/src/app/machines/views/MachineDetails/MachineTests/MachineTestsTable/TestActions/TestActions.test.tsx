import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router";

import TestActions from "./TestActions";

import { scriptStatus } from "app/base/enum";
import * as hooks from "app/base/hooks";
import {
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
} from "testing/factories";

const openMenu = (wrapper: ReactWrapper) => {
  wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
};

describe("TestActions", () => {
  let mockSendAnalytics: jest.Mock;
  let mockUseSendAnalytics: jest.Mock;

  beforeEach(() => {
    mockSendAnalytics = jest.fn();
    mockUseSendAnalytics = hooks.useSendAnalytics = jest.fn(
      () => mockSendAnalytics
    );
  });

  afterEach(() => {
    mockSendAnalytics.mockRestore();
    mockUseSendAnalytics.mockRestore();
  });

  it("can display an action to view details", () => {
    const scriptResult = scriptResultFactory({ status: scriptStatus.PASSED });
    const wrapper = mount(
      <MemoryRouter>
        <TestActions scriptResult={scriptResult} setExpanded={jest.fn()} />
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("[data-test='view-details']").exists()).toBe(true);
  });

  it("displays an action to view metrics if the test has its own results", () => {
    const scriptResult = scriptResultFactory({
      results: [scriptResultResultFactory()],
    });
    const wrapper = mount(
      <MemoryRouter>
        <TestActions scriptResult={scriptResult} setExpanded={jest.fn()} />
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("[data-test='view-metrics']").exists()).toBe(true);
  });

  it("sends an analytics event when clicking the 'View previous tests' button", () => {
    const scriptResult = scriptResultFactory();
    const wrapper = mount(
      <MemoryRouter>
        <TestActions scriptResult={scriptResult} setExpanded={jest.fn()} />
      </MemoryRouter>
    );

    openMenu(wrapper);
    wrapper.find("Button[data-test='view-previous-tests']").simulate("click");

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "View testing script history",
      "View previous tests",
    ]);
  });

  it("sends an analytics event when clicking the 'View metrics' button", () => {
    const scriptResult = scriptResultFactory();
    const wrapper = mount(
      <MemoryRouter>
        <TestActions scriptResult={scriptResult} setExpanded={jest.fn()} />
      </MemoryRouter>
    );

    openMenu(wrapper);
    wrapper.find("Button[data-test='view-metrics']").simulate("click");

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "View testing script metrics",
      "View metrics",
    ]);
  });
});