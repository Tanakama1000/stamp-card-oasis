
export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  browser: string;
  version: string;
  supportsCamera: boolean;
}

export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent);
  
  let browser = 'Unknown';
  let version = '';
  
  if (isChrome) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : '';
  } else if (isSafari) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : '';
  }
  
  const supportsCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    browser,
    version,
    supportsCamera
  };
};

export const getCameraConfigurations = (deviceInfo: DeviceInfo) => {
  const baseConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  if (deviceInfo.isIOS) {
    return [
      { ...baseConfig, qrbox: { width: 200, height: 200 } },
      { ...baseConfig, aspectRatio: 1.0 },
      { ...baseConfig, qrbox: 150 }
    ];
  }
  
  if (deviceInfo.isAndroid) {
    return [
      baseConfig,
      { ...baseConfig, qrbox: { width: 300, height: 300 } },
      { ...baseConfig, fps: 5 }
    ];
  }
  
  return [baseConfig];
};

export const getCameraConstraints = (deviceInfo: DeviceInfo) => {
  const baseConstraints = { facingMode: "environment" };
  
  if (deviceInfo.isIOS) {
    return [
      baseConstraints,
      { facingMode: { exact: "environment" } },
      { facingMode: "user" },
      { video: true }
    ];
  }
  
  if (deviceInfo.isAndroid) {
    return [
      baseConstraints,
      { facingMode: { ideal: "environment" } },
      { video: { facingMode: "environment" } },
      { facingMode: "user" }
    ];
  }
  
  return [baseConstraints, { facingMode: "user" }];
};
