import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import ActionFormWrapper from "./ActionFormWrapper";
import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";

import type { SetSearchFilter } from "app/base/types";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineActionHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";

type Props = {
  headerContent: MachineHeaderContent;
  setHeaderContent: MachineSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
  viewingDetails?: boolean;
};

export const MachineHeaderForms = ({
  headerContent,
  setHeaderContent,
  setSearchFilter,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  switch (headerContent.view) {
    case MachineHeaderViews.ADD_CHASSIS:
      return <AddChassisForm clearHeaderContent={clearHeaderContent} />;
    case MachineHeaderViews.ADD_MACHINE:
      return <AddMachineForm clearHeaderContent={clearHeaderContent} />;
    default:
      // We need to explicitly cast headerContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical-web-and-design/maas-ui/issues/3040
      const view = headerContent.view as ValueOf<
        typeof MachineActionHeaderViews
      >;
      const [, action] = view;
      return (
        <ActionFormWrapper
          action={action}
          clearHeaderContent={clearHeaderContent}
          headerContent={headerContent}
          setSearchFilter={setSearchFilter}
          viewingDetails={viewingDetails}
        />
      );
  }
};

export default MachineHeaderForms;
