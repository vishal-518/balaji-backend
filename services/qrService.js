export const buildProvisioningPayload = (imei, customerId = '', serverUrl = '') => {
  return {
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME":
      "com.balaji.app/.DeviceAdminReceiver",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION":
      process.env.APK_DOWNLOAD_URL ||
      "https://github.com/vishal-518/balaji-apk-releases/releases/download/v1.0.8/app-release.apk",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_SIGNATURE_CHECKSUM":
      process.env.APK_CHECKSUM ||
      "aZnF6jNGxjrE5x_o6OgQuum7xrrgy-Fpv-O52Gl4xZc",
    "android.app.extra.PROVISIONING_MODE": 1,
    "android.app.extra.PROVISIONING_SKIP_ENCRYPTION": true,
    "android.app.extra.PROVISIONING_LEAVE_ALL_SYSTEM_APPS_ENABLED": true,
    "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
      customerId,
      imei1: imei,
      serverUrl,
      shopName: "Balaji Communication",
      supportPhone: "9636690689",
    },
  };
};
