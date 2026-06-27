---
name: Firestore rules catch-all union pitfall
description: Why a permissive catch-all match silently defeats stricter per-collection rules, and the fix pattern used in sdm/firestore.rules
---

# Firestore rules: catch-all union defeats stricter per-collection rules

Firestore grants a request if **any** matching `allow` rule evaluates true (logical OR / union across all matching `match` blocks). A wildcard catch-all like `match /{collection}/{docId}` matches the *same path depth* as specific blocks like `match /teams/{teamId}`, so both are evaluated and unioned.

**Consequence:** adding a strict per-collection rule (e.g. `allow write: if isAdminPlus()`) does **not** tighten anything if a permissive catch-all (`allow write: if isLeaderPlus()`) still matches — the looser rule wins via union. This also silently bypassed the careful guards on `users` (validRoleChange/privilegedUnchanged) and the `audit_logs` update/delete `false`.

**Fix pattern (used in `sdm/firestore.rules`):** make the catch-all opt out of every collection that has an explicit block:
```
function hasExplicitRules(name) {
  return name in ['users','teams','cells','organization_settings',
    'announcements','events','bulletins','playlists','daily_content','audit_logs'];
}
match /{collection}/{docId} {
  allow read: if isApprovedActive();
  allow write: if isLeaderPlus() && !hasExplicitRules(collection);
}
```
**Why:** keeps the leader-write default for owner/leader collections NOT in the list (e.g. `qt_entries`, `reading_plans`, `reading_progress`) while making the explicit blocks authoritative.

**How to apply:** whenever you add a new explicit `match /<collection>/...` block intended to RESTRICT access, also add that collection name to `hasExplicitRules` (or whatever the catch-all guard is). `name in [..]` and passing the `{collection}` wildcard var into a function are valid rules syntax. Note: the catch-all `allow read` still unions — pre-existing, revisit if a collection needs stricter reads.
