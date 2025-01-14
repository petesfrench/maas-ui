import { MainTable, Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { VMS_PER_PAGE } from "../ProjectVMs";

import CoresColumn from "./CoresColumn";
import HugepagesColumn from "./HugepagesColumn";
import IPColumn from "./IPColumn";
import NameColumn from "./NameColumn";
import StatusColumn from "./StatusColumn";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes, generateCheckboxHandlers, isComparable } from "app/utils";

type Props = {
  currentPage: number;
  id: Pod["id"];
  searchFilter: string;
};

type SortKey = keyof Machine;

const getSortValue = (sortKey: SortKey, vm: Machine) => {
  switch (sortKey) {
    case "pool":
      return vm.pool?.name;
  }
  const value = vm[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (vms: Machine[], podId: Pod["id"]) =>
  vms.map((vm) => {
    const memory = formatBytes(vm.memory, "GiB", { binary: true });
    const storage = formatBytes(vm.storage, "GB");

    return {
      columns: [
        {
          className: "name-col",
          content: <NameColumn systemId={vm.system_id} />,
        },
        {
          className: "status-col",
          content: <StatusColumn systemId={vm.system_id} />,
        },
        {
          className: "ipv4-col",
          content: <IPColumn systemId={vm.system_id} version={4} />,
        },
        {
          className: "ipv6-col",
          content: <IPColumn systemId={vm.system_id} version={6} />,
        },
        {
          className: "hugepages-col",
          content: <HugepagesColumn machineId={vm.system_id} podId={podId} />,
        },
        {
          className: "cores-col u-align--right",
          content: <CoresColumn machineId={vm.system_id} podId={podId} />,
        },
        {
          className: "ram-col u-align--right",
          content: (
            <>
              <span>{memory.value} </span>
              <small className="u-text--muted">{memory.unit}</small>
            </>
          ),
        },
        {
          className: "storage-col u-align--right",
          content: (
            <>
              <span>{storage.value} </span>
              <small className="u-text--muted">{storage.unit}</small>
            </>
          ),
        },
        {
          className: "pool-col",
          content: (
            <DoubleRow primary={vm.pool.name} secondary={vm.zone.name} />
          ),
        },
      ],
      key: vm.system_id,
    };
  });

const VMsTable = ({ currentPage, id, searchFilter }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const loading = useSelector(machineSelectors.loading);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const vms = useSelector((state: RootState) =>
    podSelectors.filteredVMs(state, id, searchFilter)
  );
  const machineIDs = vms.map((vm) => vm.system_id);
  const { currentSort, sortRows, updateSort } = useTableSort<Machine, SortKey>(
    getSortValue,
    {
      key: "hostname",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedVms = sortRows(vms);
  const paginatedVms = sortedVms.slice(
    (currentPage - 1) * VMS_PER_PAGE,
    currentPage * VMS_PER_PAGE
  );
  const { handleGroupCheckbox } = generateCheckboxHandlers<
    Machine["system_id"]
  >((machineIDs) => {
    dispatch(machineActions.setSelected(machineIDs));
  });

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  return (
    <>
      <MainTable
        className="vms-table"
        headers={[
          {
            className: "name-col",
            content: (
              <div className="u-flex">
                <GroupCheckbox
                  items={machineIDs}
                  selectedItems={selectedIDs}
                  handleGroupCheckbox={handleGroupCheckbox}
                />
                <div>
                  <TableHeader
                    currentSort={currentSort}
                    data-test="name-header"
                    onClick={() => updateSort("hostname")}
                    sortKey="hostname"
                  >
                    Name
                  </TableHeader>
                </div>
              </div>
            ),
          },
          {
            className: "status-col",
            content: (
              <TableHeader
                className="p-double-row__header-spacer"
                currentSort={currentSort}
                onClick={() => updateSort("status")}
                sortKey="status"
              >
                Status
              </TableHeader>
            ),
          },
          {
            className: "ipv4-col",
            content: <TableHeader>IPv4</TableHeader>,
          },
          {
            className: "ipv6-col",
            content: <TableHeader>IPv6</TableHeader>,
          },
          {
            className: "hugepages-col",
            content: <TableHeader>Hugepages</TableHeader>,
          },
          {
            className: "cores-col u-align--right",
            content: <TableHeader>Cores</TableHeader>,
          },
          {
            className: "ram-col u-align--right",
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("memory")}
                sortKey="memory"
              >
                RAM
              </TableHeader>
            ),
          },
          {
            className: "storage-col u-align--right",
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("storage")}
                sortKey="storage"
              >
                Storage
              </TableHeader>
            ),
          },
          {
            className: "pool-col",
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("pool")}
                  sortKey="pool"
                >
                  Resource pool
                </TableHeader>
                <TableHeader>AZ</TableHeader>
              </>
            ),
          },
        ]}
        rows={generateRows(paginatedVms, id)}
      />
      {searchFilter && vms.length === 0 ? (
        <Strip shallow rowClassName="u-align--center">
          <span data-test="no-vms">
            No VMs in this VM host match the search criteria.
          </span>
        </Strip>
      ) : null}
    </>
  );
};

export default VMsTable;
