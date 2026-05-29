/**
 * The outcome the DOM modal hands back to the orchestrator — which categories
 * and services the user left enabled, plus the derived overall grant flag.
 */
export interface ConsentDecision {
  /** Personalized-ads grant forwarded to LevelPlay (true when Marketing is on). */
  granted: boolean;
  /** Per-category toggle state, keyed by category ID. */
  categories: Record<string, boolean>;
  /** Per-service toggle state, keyed by service ID. */
  services: Record<string, boolean>;
}
