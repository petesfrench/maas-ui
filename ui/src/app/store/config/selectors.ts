import { createSelector } from "@reduxjs/toolkit";

import type {
  AutoIpmiPrivilegeLevel,
  Config,
  ConfigState,
  ConfigValues,
  NetworkDiscovery,
} from "app/store/config/types";
import type { StorageLayout } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns value of an object in an array, given a certain name.
 * @param {Config[]} arr - Array to search for name.
 * @param {Config["name"]} name - Name paramenter of the object to search for.
 * @returns Value parameter of found object.
 */
const getValueFromName = <V extends ConfigValues>(
  arr: Config<ConfigValues>[],
  name: Config<V>["name"]
): Config<V>["value"] | null => {
  const found = arr.find((item) => item.name === name);
  if (found) {
    return found.value as V;
  }
  return null;
};

type Option = {
  label: string;
  value: string | number;
};

/**
 * Returns choices of an object in an array, given a certain name.
 * @param arr - Array to search for name.
 * @param name - Name paramenter of the object to search for.
 * @returns Available choices.
 */
const getOptionsFromName = <V extends ConfigValues>(
  arr: Config<ConfigValues>[],
  name: Config<V>["name"]
): Option[] | null => {
  const found = arr.find((item) => item.name === name);
  if (found && found.choices) {
    return found.choices.map((choice) => ({
      value: choice[0],
      label: choice[1],
    }));
  }
  return null;
};

/**
 * The config slice of state.
 * @param state - The redux state.
 * @returns The config state.
 */
const configState = (state: RootState): ConfigState => state.config;

/**
 * Returns the config errors.
 * @param state - The redux state.
 * @returns Config errors.
 */
const errors = createSelector([configState], (config) => config.errors);

/**
 * Returns list of all MAAS configs
 * @param state - The redux state.
 * @returns {Config[]} A list of all state.config.items.
 */
const all = (state: RootState): Config<ConfigValues>[] => state.config.items;

/**
 * Returns true if config is loading.
 * @param state - The redux state.
 * @returns {ConfigState["loading"]} Config is loading.
 */
const loading = (state: RootState): boolean => state.config.loading;

/**
 * Returns true if config has been loaded.
 * @param state - The redux state.
 * @returns {ConfigState["loaded"]} Config has loaded.
 */
const loaded = (state: RootState): boolean => state.config.loaded;

/**
 * Returns true if config is saving.
 * @param state - The redux state.
 * @returns {ConfigState["saving"]} Config is saving.
 */
const saving = (state: RootState): boolean => state.config.saving;

/**
 * Returns true if config has saved.
 * @param state - The redux state.
 * @returns {ConfigState["saved"]} Config has saved.
 */
const saved = (state: RootState): boolean => state.config.saved;

/**
 * Returns the MAAS config for default storage layout.
 * @param state - The redux state.
 * @returns Default storage layout.
 */
const defaultStorageLayout = createSelector([all], (configs) =>
  getValueFromName<StorageLayout>(configs, "default_storage_layout")
);

/**
 * Returns the possible storage layout options reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} Storage layout options.
 */
const storageLayoutOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "default_storage_layout")
);

/**
 * Returns the MAAS config for enabling disk erase on release.
 * @param state - The redux state.
 * @returns Enable disk erasing on release.
 */
const enableDiskErasing = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "enable_disk_erasing_on_release")
);

/**
 * Returns the MAAS config for enabling disk erase with secure erase.
 * @param state - The redux state.
 * @returns Enable disk erasing with secure erase.
 */
const diskEraseWithSecure = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "disk_erase_with_secure_erase")
);

/**
 * Returns the MAAS config for enabling disk erase with quick erase.
 * @param state - The redux state.
 * @returns Enable disk erasing with quick erase.
 */
const diskEraseWithQuick = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "disk_erase_with_quick_erase")
);

/**
 * Returns the MAAS config for http proxy url.
 * @param state - The redux state.
 * @returns HTTP proxy.
 */
const httpProxy = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "http_proxy")
);

/**
 * Returns the MAAS config for enabling http proxy.
 * @param state - The redux state.
 * @returns Enable HTTP proxy.
 */
const enableHttpProxy = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "enable_http_proxy")
);

/**
 * Returns the MAAS config for using peer proxy.
 * @param state - The redux state.
 * @returns Use peer proxy.
 */
const usePeerProxy = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "use_peer_proxy")
);

/**
 * Returns the proxy type, given other proxy config.
 * @param state - The redux state.
 * @returns {String} Proxy type.
 */
const proxyType = createSelector(
  [httpProxy, enableHttpProxy, usePeerProxy],
  (httpProxy, enableHttpProxy, usePeerProxy) => {
    if (enableHttpProxy) {
      if (httpProxy) {
        if (usePeerProxy) {
          return "peerProxy";
        } else {
          return "externalProxy";
        }
      } else {
        return "builtInProxy";
      }
    }
    return "noProxy";
  }
);

/**
 * Returns the MAAS config for MAAS name.
 * @param - The redux state.
 * @returns Then MAAS name.
 */
const maasName = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "maas_name")
);

/**
 * Returns the MAAS config for MAAS uuid.
 * @param - The redux state.
 * @returns Then MAAS uuid.
 */
const uuid = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "uuid")
);

/**
 * Returns the MAAS config for enable analytics.
 * @param - The redux state.
 * @returns Enable analytics.
 */
const analyticsEnabled = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "enable_analytics")
);

/**
 * Returns the MAAS config for default distro series.
 * @param state - The redux state.
 * @returns Default distro series.
 */
const commissioningDistroSeries = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "commissioning_distro_series")
);

/**
 * Returns the possible distro series options reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} Distro series options.
 */
const distroSeriesOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "commissioning_distro_series")
);

/**
 * Returns the MAAS config for default min kernel version.
 * @param state - The redux state.
 * @returns Default min kernal version.
 */
const defaultMinKernelVersion = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "default_min_hwe_kernel")
);

/**
 * Returns the MAAS config for enabling DNSSEC validation of upstream zones.
 * @param state - The redux state.
 * @returns DNSSEC validation type.
 */
const dnssecValidation = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "dnssec_validation")
);

/**
 * Returns the possible DNSSEC validation options reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} DNSSEC validation options.
 */
const dnssecOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "dnssec_validation")
);

/**
 * Returns the MAAS config for the list of external networks that will be allowed to use MAAS for DNS resolution.
 * @param state - The redux state.
 * @returns External networks.
 */
const dnsTrustedAcl = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "dns_trusted_acl")
);

/**
 * Returns the MAAS config for upstream DNS.
 * @param state - The redux state.
 * @returns Upstream DNS(s).
 */
const upstreamDns = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "upstream_dns")
);

/**
 * Returns the MAAS config for NTP servers.
 * @param state - The redux state.
 * @returns NTP server(s).
 */
const ntpServers = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "ntp_servers")
);

/**
 * Returns the MAAS config for only enabling external NTP servers.
 * @param state - The redux state.
 * @returns Enable external NTP servers only.
 */
const ntpExternalOnly = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "ntp_external_only")
);

/**
 * Returns the MAAS config for remote syslog server to forward machine logs.
 * @param state - The redux state.
 * @returns Remote syslog server.
 */
const remoteSyslog = createSelector([all], (configs) =>
  getValueFromName<string | null>(configs, "remote_syslog")
);

/**
 * Returns the MAAS config for enabling network discovery.
 * @param state - The redux state.
 * @returns Enable network discovery.
 */
const networkDiscovery = createSelector([all], (configs) =>
  getValueFromName<NetworkDiscovery>(configs, "network_discovery")
);

/**
 * Returns the possible network discovery options reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} Network discovery options.
 */
const networkDiscoveryOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "network_discovery")
);

/**
 * Returns the MAAS config for active discovery interval.
 * @param state - The redux state.
 * @returns Active discovery interval in ms.
 */
const activeDiscoveryInterval = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "active_discovery_interval")
);

/**
 * Returns the possible active discovery intervals reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} Active discovery intervals.
 */
const discoveryIntervalOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "active_discovery_interval")
);

/**
 * Returns the MAAS config for kernel parameters.
 * @param state - The redux state.
 * @returns Kernel parameters.
 */
const kernelParams = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "kernel_opts")
);

/**
 * Returns the MAAS config for Windows KMS host.
 * @param state - The redux state.
 * @returns Windows KMS host.
 */
const windowsKmsHost = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "windows_kms_host")
);

/**
 * Returns the MAAS config for vCenter server.
 * @param state - The redux state.
 * @returns - vCenter server.
 */
const vCenterServer = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "vcenter_server")
);

/**
 * Returns the MAAS config for vCenter username.
 * @param state - The redux state.
 * @returns - vCenter username.
 */
const vCenterUsername = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "vcenter_username")
);

/**
 * Returns the MAAS config for vCenter password.
 * @param state - The redux state.
 * @returns - vCenter password.
 */
const vCenterPassword = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "vcenter_password")
);

/**
 * Returns the MAAS config for vCenter datacenter.
 * @param state - The redux state.
 * @returns - vCenter datacenter.
 */
const vCenterDatacenter = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "vcenter_datacenter")
);

/**
 * Returns the MAAS config for enable_third_party_drivers
 * @param state - The redux state
 * @returns - The value of enable_third_party_drivers
 */
const thirdPartyDriversEnabled = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "enable_third_party_drivers")
);

/**
 * Returns the MAAS config for default OS.
 * @param state - The redux state.
 * @returns Default OS.
 */
const defaultOSystem = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "default_osystem")
);

/**
 * Returns the possible default OS options reformatted as objects.
 * @param state - The redux state.
 * @returns {Option[]} Default OS options.
 */
const defaultOSystemOptions = createSelector([all], (configs) =>
  getOptionsFromName<string>(configs, "default_osystem")
);

/**
 * Returns the MAAS config for default distro series.
 * @param state - The redux state.
 * @returns Default distro series.
 */
const defaultDistroSeries = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "default_distro_series")
);

/**
 * Returns the MAAS config for default IPMI user.
 * @param state - The redux state.
 * @returns Default IPMI user.
 */
const maasAutoIpmiUser = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "maas_auto_ipmi_user")
);

/**
 * Returns the MAAS config for the IPMI user privilege level.
 * @param state - The redux state.
 * @returns IPMI privilege level.
 */
const maasAutoUserPrivilegeLevel = createSelector([all], (configs) =>
  getValueFromName<AutoIpmiPrivilegeLevel>(
    configs,
    "maas_auto_ipmi_user_privilege_level"
  )
);

/**
 * Returns the MAAS config for the IPMI BMC key.
 * @param state - The redux state.
 * @returns BMC key.
 */
const maasAutoIpmiKGBmcKey = createSelector([all], (configs) =>
  getValueFromName<string>(configs, "maas_auto_ipmi_k_g_bmc_key")
);

/**
 * Returns the MAAS config for whether the intro has been completed.
 * @param state - The redux state.
 * @returns Whether the intro has been completed
 */
const completedIntro = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "completed_intro")
);

/**
 * Returns the MAAS config for whether the release notifications are enabled.
 * @param state - The redux state.
 * @returns Whether the release notifications are enabled.
 */
const releaseNotifications = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "release_notifications")
);

/**
 * Returns the MAAS config for whether to automatically sync images.
 * @param state - The redux state.
 * @returns Whether the release notifications are enabled.
 */
const bootImagesAutoImport = createSelector([all], (configs) =>
  getValueFromName<boolean>(configs, "boot_images_auto_import")
);

const config = {
  activeDiscoveryInterval,
  all,
  analyticsEnabled,
  bootImagesAutoImport,
  commissioningDistroSeries,
  completedIntro,
  defaultDistroSeries,
  defaultMinKernelVersion,
  defaultOSystem,
  defaultOSystemOptions,
  defaultStorageLayout,
  discoveryIntervalOptions,
  diskEraseWithQuick,
  diskEraseWithSecure,
  distroSeriesOptions,
  dnssecOptions,
  dnssecValidation,
  dnsTrustedAcl,
  enableDiskErasing,
  enableHttpProxy,
  errors,
  httpProxy,
  kernelParams,
  loaded,
  loading,
  maasName,
  maasAutoIpmiUser,
  maasAutoIpmiKGBmcKey,
  maasAutoUserPrivilegeLevel,
  networkDiscovery,
  networkDiscoveryOptions,
  ntpExternalOnly,
  ntpServers,
  proxyType,
  releaseNotifications,
  remoteSyslog,
  saved,
  saving,
  storageLayoutOptions,
  thirdPartyDriversEnabled,
  upstreamDns,
  usePeerProxy,
  uuid,
  vCenterDatacenter,
  vCenterPassword,
  vCenterServer,
  vCenterUsername,
  windowsKmsHost,
};

export default config;
