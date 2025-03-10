import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditAliasOrVlanForm from "../EditAliasOrVlanForm";
import EditBondForm from "../EditBondForm";
import EditBridgeForm from "../EditBridgeForm";
import EditPhysicalForm from "../EditPhysicalForm";
import InterfaceFormTable from "../InterfaceFormTable";
import type { Selected, SetSelected } from "../NetworkTable/types";

import FormCard from "app/base/components/FormCard";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import {
  getInterfaceType,
  getLinkFromNic,
  isMachineDetails,
} from "app/store/machine/utils";
import { getInterfaceTypeText } from "app/store/machine/utils/networking";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";

type Props = {
  close: () => void;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
  selected: Selected[];
  setSelected: SetSelected;
  systemId: MachineDetails["system_id"];
};

const EditInterface = ({
  close,
  linkId,
  nicId,
  selected,
  setSelected,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);
  if (!isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }
  const interfaceType = getInterfaceType(machine, nic, link);
  let form: ReactNode;
  let showTable = true;
  const interfaceTypeDisplay = getInterfaceTypeText(machine, nic, link);
  if (interfaceType === NetworkInterfaceTypes.PHYSICAL) {
    form = (
      <EditPhysicalForm
        close={close}
        linkId={linkId}
        nicId={nicId}
        systemId={systemId}
      />
    );
  } else if (
    interfaceType === NetworkInterfaceTypes.ALIAS ||
    interfaceType === NetworkInterfaceTypes.VLAN
  ) {
    form = (
      <EditAliasOrVlanForm
        close={close}
        interfaceType={interfaceType}
        link={link}
        nic={nic}
        systemId={systemId}
      />
    );
  } else if (interfaceType === NetworkInterfaceTypes.BRIDGE) {
    form = (
      <EditBridgeForm close={close} link={link} nic={nic} systemId={systemId} />
    );
  } else if (interfaceType === NetworkInterfaceTypes.BOND) {
    showTable = false;
    form = (
      <EditBondForm
        close={close}
        link={link}
        nic={nic}
        selected={selected}
        setSelected={setSelected}
        systemId={systemId}
      />
    );
  }
  return (
    <FormCard sidebar={false} stacked title={`Edit ${interfaceTypeDisplay}`}>
      {showTable && (
        <InterfaceFormTable
          interfaces={[{ linkId, nicId }]}
          systemId={systemId}
        />
      )}
      {form}
    </FormCard>
  );
};

export default EditInterface;
