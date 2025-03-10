import { Button, Col, Icon, Row, Strip } from "@canonical/react-components";

import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetHeaderContent } from "app/machines/types";
import type { MachineDetails } from "app/store/machine/types";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { NodeDevice } from "app/store/nodedevice/types";
import { NodeActions, NodeStatusCode } from "app/store/types/node";

type Props = {
  bus: NodeDeviceBus;
  machine: MachineDetails;
  nodeDevices: NodeDevice[];
  setHeaderContent: MachineSetHeaderContent;
};

const NodeDevicesWarning = ({
  bus,
  machine,
  nodeDevices,
  setHeaderContent,
}: Props): JSX.Element | null => {
  const busDisplay = bus === NodeDeviceBus.PCIE ? "PCI" : "USB";
  const canBeCommissioned = machine?.actions.includes(NodeActions.COMMISSION);
  const noDevices = nodeDevices.length === 0;
  const noUSB = !nodeDevices.some((device) => device.bus === NodeDeviceBus.USB);

  let warning: React.ReactNode;
  if (noDevices) {
    let warningMessage: string;
    if (canBeCommissioned) {
      warningMessage =
        "Try commissioning this machine to load PCI and USB device information.";
    } else {
      if (machine.locked) {
        warningMessage =
          "The machine is locked. Unlock and release this machine before commissioning to load PCI and USB device information.";
      } else if (machine.status_code === NodeStatusCode.FAILED_TESTING) {
        warningMessage =
          "Override failed testing before commissioning to load PCI and USB device information.";
      } else if (machine.status_code === NodeStatusCode.DEPLOYED) {
        warningMessage =
          "Release this machine before commissioning to load PCI and USB device information.";
      } else if (machine.status_code === NodeStatusCode.COMMISSIONING) {
        warningMessage = "Commissioning is currently in progress...";
      } else {
        warningMessage = "Commissioning cannot be run at this time.";
      }
    }
    warning = (
      <>
        <h4>No {busDisplay} information</h4>
        <p className="u-sv1" data-test="no-devices">
          {warningMessage}
        </p>
        {canBeCommissioned && (
          <Button
            appearance="positive"
            data-test="commission-machine"
            onClick={() =>
              setHeaderContent({ view: MachineHeaderViews.COMMISSION_MACHINE })
            }
          >
            Commission
          </Button>
        )}
      </>
    );
  } else if (bus === NodeDeviceBus.USB && noUSB) {
    warning = (
      <>
        <h4>No USB information</h4>
        <p className="u-sv1" data-test="no-usb">
          No USB devices discovered during commissioning.
        </p>
      </>
    );
  }
  return warning ? (
    <Strip data-test="node-devices-warning" shallow>
      <Row>
        <Col className="u-flex" emptyLarge={4} size={6}>
          <h4>
            <Icon name="warning" />
          </h4>
          <div className="u-flex--grow u-nudge-right">{warning}</div>
        </Col>
      </Row>
    </Strip>
  ) : null;
};

export default NodeDevicesWarning;
