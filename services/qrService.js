export const buildProvisioningPayload = (imei) => {
  return {
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME":
      "com.balajicommunication.locker/.DeviceAdminReceiver",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION":
      process.env.APK_DOWNLOAD_URL || "https://balajicommunication.in/apk/locker.apk",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM":
      process.env.APK_CHECKSUM || "YOUR_CHECKSUM_HASH",
    "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
      imei,
      shopName: "Balaji Communication",
      supportPhone: "9636690689",
    },
  };
};