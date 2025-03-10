import { useCallback } from "react";

import AddKVM from "./AddKVM";
import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import type { MachineHeaderContent } from "app/machines/types";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
};

const getFormComponent = (
  headerContent: KVMHeaderContent,
  setHeaderContent: KVMSetHeaderContent,
  clearHeaderContent: ClearHeaderContent,
  setSearchFilter?: SetSearchFilter
) => {
  switch (headerContent.view) {
    case KVMHeaderViews.ADD_KVM:
      return <AddKVM clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderViews.COMPOSE_VM:
      return <ComposeForm clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderViews.DELETE_KVM:
      return <DeleteForm clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderViews.REFRESH_KVM:
      return <RefreshForm clearHeaderContent={clearHeaderContent} />;
    default:
      // We need to explicitly cast headerContent here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical-web-and-design/maas-ui/issues/3040
      const machineHeaderContent = headerContent as MachineHeaderContent;
      return (
        <MachineHeaderForms
          headerContent={machineHeaderContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      );
  }
};

const KVMHeaderForms = ({
  headerContent,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  if (!headerContent) {
    return null;
  }
  return (
    <div ref={onRenderRef}>
      {getFormComponent(
        headerContent,
        setHeaderContent,
        clearHeaderContent,
        setSearchFilter
      )}
    </div>
  );
};

export default KVMHeaderForms;
