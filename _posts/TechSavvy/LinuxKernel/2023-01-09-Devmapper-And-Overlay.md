---
title: Devmapper and Overlay, Understanding the Differences 
author: Jay Lee
date: 2023-01-09 00:00:00 +0800
categories: [TechSavvy, LinuxKernel]
tags: [Blogging, Linux, Docker, EmbeddedLinux, Overlay, Devmapper, kernel, filesystem]
image: /assets/img/OverlayFS_Image.png
---

# Devmapper and Overlay: Understanding the Differences

In the world of Linux kernel features, two names that often come up in discussions about storage and containerization are devmapper and overlay. Although they may sound similar, they are actually quite different and serve distinct purposes. In this post, we will take a closer look at what each of these features does and how they can be used.

## Devmapper: Virtual Block Devices for Advanced Storage Configurations

Devmapper, short for "device mapper," is a kernel framework that allows you to create virtual block devices, called logical volumes. These logical volumes can be mapped to physical devices or other logical volumes, and can be used for a variety of purposes. Some of the things you can do with devmapper include:

- Creating RAID arrays
- Taking snapshots of logical volumes
- Implementing thin provisioning
- Encrypting block devices at the kernel level

When you create a logical volume with devmapper, it appears as a regular block device to the rest of the system. You can format it with a filesystem or use it as a raw block device for other purposes. One of the most common use cases for devmapper is creating encrypted block devices, which can be used to protect sensitive data. Another use case is creating logical volumes that span multiple physical devices, which can be useful for creating large storage spaces or implementing redundancy.

## OverlayFS: A Filesystem for Overlaying Directories

OverlayFS, on the other hand, is a filesystem that allows you to overlay one directory on top of another. This can be useful for creating a unified view of a read-only filesystem and a writable filesystem. For example, when using containerization, you can use an image of a read-only filesystem as the lower layer and a container's writable filesystem as the upper layer. This way, when a file is accessed, it will be looked up in the upper layer first and if it is not present, it will be looked up in the lower layer. Writes will go to the upper layer, which is the container's writable filesystem. This allows you to use a single image for multiple containers and have them all share a read-only filesystem but have their own writable layer.

## Conclusion

In summary, devmapper and overlay are two powerful Linux kernel features that can be used for different purposes. Devmapper allows you to create virtual block devices for advanced storage configurations, while OverlayFS is a filesystem that allows you to overlay one directory on top of another. Understanding the differences between these two features can help you make better decisions when designing your storage and containerization solutions.