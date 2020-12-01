import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import type { Disk, Filesystem, Partition } from "app/store/machine/types";
import { formatBytes } from "app/utils";

/**
 * Returns whether a filesystem can be formatted.
 * @param fs - the filesystem to check.
 * @returns whether the filesystem can be formatted
 */
export const canBeFormatted = (fs: Filesystem | null): boolean =>
  fs?.is_format_fstype || false;

/**
 * Returns whether a disk can be partitioned.
 * @param disk - the disk to check.
 * @returns whether the disk can be partitioned.
 */
export const canBePartitioned = (disk: Disk | null): boolean => {
  if (
    !disk ||
    isBcache(disk) ||
    isLogicalVolume(disk) ||
    isVolumeGroup(disk) ||
    isMounted(disk.filesystem)
  ) {
    return false;
  }

  // TODO: This does not take into account space that needs to be reserved.
  // https://github.com/canonical-web-and-design/MAAS-squad/issues/2274
  return disk.available_size >= MIN_PARTITION_SIZE;
};

/**
 * Returns whether a disk is available to use.
 * @param disk - the disk to check.
 * @returns whether the disk is available to use
 */
export const diskAvailable = (disk: Disk | null): boolean => {
  if (!disk || isCacheSet(disk) || isMounted(disk.filesystem)) {
    return false;
  }

  return disk.available_size >= MIN_PARTITION_SIZE;
};

/**
 * Formats a storage device's size for use in tables.
 * @param size - the size of the storage device in bytes.
 * @returns formatted size string.
 */
export const formatSize = (size: number | null): string => {
  const formatted = !!size && formatBytes(size, "B");
  return formatted ? `${formatted.value} ${formatted.unit}` : "—";
};

/**
 * Formats a storage device's type for use in tables.
 * @param storageDevice - the storage device to check.
 * @returns formatted type string.
 */
export const formatType = (storageDevice: Disk | Partition | null): string => {
  if (!storageDevice) {
    return "Unknown";
  }

  let typeToFormat = storageDevice.type;
  if (!isPartition(storageDevice)) {
    const disk = storageDevice as Disk;
    if (isVirtual(disk)) {
      if (isLogicalVolume(disk)) {
        return "Logical volume";
      } else if (isRaid(disk)) {
        const raidLevel = disk.parent?.type.split("-")[1];
        return raidLevel ? `RAID ${raidLevel}` : "RAID";
      }
      typeToFormat = disk.parent?.type || "Unknown";
    }
  }

  switch (typeToFormat) {
    case "cache-set":
      return "Cache set";
    case "iscsi":
      return "ISCSI";
    case "lvm-vg":
      return "Volume group";
    case "partition":
      return "Partition";
    case "physical":
      return "Physical";
    case "virtual":
      return "Virtual";
    case "vmfs6":
      return "VMFS6";
    default:
      return typeToFormat;
  }
};

/**
 * Returns whether a disk is a bcache.
 * @param disk - the disk to check.
 * @returns whether the disk is a bcache
 */
export const isBcache = (disk: Disk | null): boolean =>
  isVirtual(disk) && disk?.parent?.type === "bcache";

/**
 * Returns whether a disk is a cache set.
 * @param disk - the disk to check.
 * @returns whether the disk is a cache set
 */
export const isCacheSet = (disk: Disk | null): boolean =>
  disk?.type === "cache-set";

/**
 * Returns whether a filesystem is a VMFS6 datastore.
 * @param fs - the filesystem to check.
 * @returns whether the filesystem is a VMFS6 datastore
 */
export const isDatastore = (fs: Filesystem | null): boolean =>
  fs?.fstype === "vmfs6";

/**
 * Returns whether a disk is a logical volume.
 * @param disk - the disk to check.
 * @returns whether the disk is a logical volume
 */
export const isLogicalVolume = (disk: Disk | null): boolean =>
  (isVirtual(disk) && disk?.parent?.type === "lvm-vg") || false;

/**
 * Returns whether a filesystem is mounted.
 * @param fs - the filesystem to check.
 * @returns whether the filesystem is mounted
 */
export const isMounted = (fs: Filesystem | null): boolean => !!fs?.mount_point;

/**
 * Returns whether a storage device is a partition.
 * @param storageDevice - the storage device to check.
 * @returns whether the storage device is a partition
 */
export const isPartition = (storageDevice: Disk | Partition | null): boolean =>
  storageDevice?.type === "partition";

/**
 * Returns whether a disk is a physical disk.
 * @param disk - the disk to check.
 * @returns whether the disk is a physical disk
 */
export const isPhysical = (disk: Disk | null): boolean =>
  disk?.type === "physical";

/**
 * Returns whether a disk is a RAID.
 * @param disk - the disk to check.
 * @returns whether the disk is a RAID
 */
export const isRaid = (disk: Disk | null): boolean =>
  (isVirtual(disk) && disk?.parent?.type.startsWith("raid-")) || false;

/**
 * Returns whether a disk is a virtual disk.
 * @param disk - the disk to check.
 * @returns whether the disk is a virtual disk
 */
export const isVirtual = (disk: Disk | null): boolean =>
  disk?.type === "virtual" && "parent" in disk;

/**
 * Returns whether a disk is a volume group.
 * @param disk - the disk to check.
 * @returns whether the disk is a volume group
 */
export const isVolumeGroup = (disk: Disk | null): boolean =>
  disk?.type === "lvm-vg";

/**
 * Returns whether a partition is available to use.
 * @param partition - the partition to check.
 * @returns whether the partition is available to use
 */
export const partitionAvailable = (partition: Partition | null): boolean => {
  if (!partition || isMounted(partition.filesystem)) {
    return false;
  }

  return canBeFormatted(partition.filesystem);
};