
  export const normalizeVal = (minVal: number, maxVal: number, val: number): number => {
    return (val - minVal) / (maxVal - minVal);
  }
  
  // clamping the value so it doesnt go above max or below min value
  export const clamp = (minVal: number, maxVal: number, val: number): number => {
    if (val > maxVal) {
      val = maxVal;
    } else if (val <= minVal) {
      val = minVal;
    }
    return val;
  }
