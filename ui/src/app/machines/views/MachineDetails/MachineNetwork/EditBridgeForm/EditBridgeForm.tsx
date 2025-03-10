import { useCallback, useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { BridgeFormValues } from "../AddBridgeForm/types";
import BridgeFormFields from "../BridgeFormFields";
import { networkFieldsSchema } from "../NetworkFields/NetworkFields";

import FormikForm from "app/base/components/FormikForm";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  MachineDetails,
  UpdateInterfaceParams,
} from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isMachineDetails } from "app/store/machine/utils";
import { getInterfaceTypeText } from "app/store/machine/utils/networking";
import type { RootState } from "app/store/root/types";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { preparePayload } from "app/utils";

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  bridge_fd: Yup.number(),
  bridge_stp: Yup.boolean(),
  bridge_type: Yup.string().required("Bridge type is required"),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

type Props = {
  close: () => void;
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: MachineDetails["system_id"];
};

const EditBridgeForm = ({
  close,
  link,
  nic,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingInterface",
    "updateInterface",
    () => close()
  );

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (vlansLoading || !nic || !isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }
  const interfaceTypeDisplay = getInterfaceTypeText(machine, nic, link);
  return (
    <FormikForm<BridgeFormValues, MachineEventErrors>
      allowUnchanged
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        bridge_fd: nic.params?.bridge_fd || "",
        bridge_stp: nic.params?.bridge_stp || false,
        bridge_type: nic.params?.bridge_type || "",
        fabric: vlan?.fabric || "",
        ip_address: link?.ip_address || "",
        mac_address: nic.mac_address,
        mode: link?.mode || "",
        name: nic.name,
        subnet: link?.subnet_id || "",
        tags: nic.tags,
        vlan: nic.vlan_id,
      }}
      onSaveAnalytics={{
        action: "Edit bridge",
        category: "Machine details networking",
        label: "Edit bridge form",
      }}
      onCancel={close}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        const payload = preparePayload({
          ...values,
          interface_id: nic.id,
          link_id: link?.id,
          system_id: systemId,
        }) as UpdateInterfaceParams;
        dispatch(machineActions.updateInterface(payload));
      }}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel={`Save ${interfaceTypeDisplay}`}
      validationSchema={InterfaceSchema}
    >
      <BridgeFormFields typeDisabled />
    </FormikForm>
  );
};

export default EditBridgeForm;
