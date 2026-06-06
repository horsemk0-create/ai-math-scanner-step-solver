# Firestore Security Blueprint Spec

This document details the data invariants and the "Dirty Dozen" attack vectors mapped out for our academic solver application.

## 1. Data Invariants
- A user can only access, write, or view their own user profile document at `/users/{userId}`.
- A user can only create or examine history records under their own authenticated parent document (`/users/{userId}/history/{historyId}`).
- Users cannot override their academic plan or bypass validation rules.
- Path variables must be verified, and timestamps must follow server time (`request.time`).

## 2. The "Dirty Dozen" Rogue Payloads (Blocked Vectors)
We block and verify denial for the following payloads:

1. **Identity Spoofing on Profile:** User `alice` attempts to write profile for user `bob` inside `/users/bob`.
2. **Identity Spoofing on Session:** User `alice` attempts to register a solver history item under `/users/bob/history/h1`.
3. **Ghost Field Poisoning:** User attempts to inject an unauthorized high-privilege flag like `isAdmin: true` or `curriculumOverride: true` in their User profile.
4. **License Level Spoofing:** Creating profiles without a valid subscription tier (e.g., setting `"plan": "unlimited-free-bypass"`).
5. **Path ID Poisoning:** Injecting extremely long, malicious string hashes into `{historyId}` to exhaust Firestore memory thresholds.
6. **Self-Assigned Modification:** Attempting to alter the immutable field `uid` or `email` after a document is already provisioned on the server.
7. **Client Time Spoofing on Create:** Providing a client-generated timestamp instead of `request.time` in `updatedAt` / `timestamp`.
8. **Client Time Spoofing on Update:** Replacing server time with stale epochs during write operations.
9. **Blanket Query List Attack:** Querying the entire path `/users` or history without safe relational filters restricting to their own `uid`.
10. **Orphaned Write Attack:** Synchronizing historical entries without verifying if the target user profile itself exists.
11. **Malformed Schema Type Injection:** Sending numeric representation values into string parameters like `subject` or `classLevel`.
12. **Truncated Formula Capture:** Submitting empty string payloads for `input` or mathematical step definitions.

---

## 3. Test Assertion Suite

The following mock TypeScript test suite is modeled to represent validation testing logic:

```typescript
// firestore.rules.test.ts
// Verifies security rule denial on rogue inputs

import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe("Math Solver Fortress Rules", () => {
  let testEnv: any;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0813459014"
    });
  });

  it("should block Alice from creating Bob's profile", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    await assertFails(
      aliceDb.doc("users/bob").set({
        uid: "bob",
        name: "Bob",
        email: "bob@edu.com",
        plan: "explorer",
        updatedAt: new Date().toISOString()
      })
    );
  });

  it("should successfully allow Alice to establish her own profile with server timestamp", async () => {
    // Verified schema creation
  });
});
```
