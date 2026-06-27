---
name: Firestore converters & write refs
description: How to type FirestoreDataConverter and which refs to use for reads vs writes in the sdm Next/Firebase app.
---

# Firestore converter signature
`fromFirestore` MUST match Firestore's `FirestoreDataConverter`: signature is
`fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions)`, and
the body reads `const data = snapshot.data(options)`. A converter written as
`fromFirestore(data: Record<string, unknown>)` fails `withConverter()` typing.

**Why:** `snapshot.data()` returns `DocumentData` (members typed `any`), which also
silently resolves "unknown not assignable to Timestamp" errors when mapping
`createdAt`/`updatedAt`. The `Record<string, unknown>` variant both breaks the
`withConverter` overload AND surfaces `unknown`→`Timestamp` errors.

# Reads vs writes
- READS: collection/doc refs WITH `.withConverter(xConverter)` — gives typed `data()`.
- WRITES (`updateDoc`, `addDoc`, partial `setDoc`): use PLAIN refs WITHOUT the
  converter. A converter-typed ref forces `UpdateData<T>`/`WithFieldValue<T>`, which
  rejects `string | null` partials and `null` for non-null model fields.

**How to apply:** keep a converter ref for queries/getDoc, and a separate plain ref
(e.g. `userWriteDoc`, `collection(db, COLLECTIONS.X)`) for write calls. Full-document
`setDoc` of a complete model can use either, but partials must use the plain ref.
