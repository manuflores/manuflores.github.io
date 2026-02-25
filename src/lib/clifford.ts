/**
 * Clifford strange attractor: discrete map
 * x' = sin(a*y) + c*cos(a*x)
 * y' = sin(b*x) + d*cos(b*y)
 */

export interface CliffordParams {
  a: number
  b: number
  c: number
  d: number
}

export function cliffordStep(
  x: number,
  y: number,
  params: CliffordParams,
): [number, number] {
  const { a, b, c, d } = params
  const nx = Math.sin(a * y) + c * Math.cos(a * x)
  const ny = Math.sin(b * x) + d * Math.cos(b * y)
  return [nx, ny]
}

/** Drift parameters over time for active animation (incommensurate rates). */
export function driftParams(
  base: CliffordParams,
  t: number,
  amount = 0.25,
): CliffordParams {
  return {
    a: base.a + amount * Math.sin(t * 0.0002),
    b: base.b + amount * 0.8 * Math.cos(t * 0.00017),
    c: base.c + amount * Math.sin(t * 0.00023),
    d: base.d + amount * 0.8 * Math.cos(t * 0.00019),
  }
}

/** Main figure: change these values to get different shapes (wings, spirals, tendrils). */
export const CLIFFORD_BASE_PARAMS: CliffordParams = {
  a: -1.7,
  b: 1.8,
  c: -1.9,
  d: -0.4,
}
