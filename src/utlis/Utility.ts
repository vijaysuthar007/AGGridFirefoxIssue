export const setExpendWindow = (windowRef: Window | null, keyName: string) => {
  window[keyName] = windowRef;
};
export const getExpendWindow = (keyName: string) => {
  return window[keyName];
};
