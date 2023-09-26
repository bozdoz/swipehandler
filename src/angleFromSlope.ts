/** get angle from a line slope */
function angleFromSlope(m: number) {
  return (Math.atan(m) * 180) / Math.PI;
}

export default angleFromSlope;
