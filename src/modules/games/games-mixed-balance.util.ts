import { balanceSides, type SideSplit } from './games-balancing.util';

/**
 * Mixed format: place at least `minWomenPerTeam` women on each side, then balance the rest by position.
 * Caller must ensure `womanUserIds.length >= minWomenPerTeam * 2`.
 */
export function balanceSidesMixed(
  gameMode: string,
  userIds: string[],
  positionByUser: Map<string, string>,
  womanUserIds: readonly string[],
  minWomenPerTeam: number,
): SideSplit {
  const pool = new Set(userIds);
  const women = womanUserIds.filter((id) => pool.has(id));
  const k = Math.max(0, minWomenPerTeam);
  if (women.length < k * 2) {
    throw new Error('INSUFFICIENT_WOMEN_FOR_MIXED');
  }
  const womenA = women.slice(0, k);
  const womenB = women.slice(k, k * 2);
  const taken = new Set<string>([...womenA, ...womenB]);
  const rest = userIds.filter((id) => !taken.has(id));
  const sub = balanceSides(gameMode, rest, positionByUser);
  return { A: [...womenA, ...sub.A], B: [...womenB, ...sub.B] };
}
