# Migration `20200612231924-rename-group-org-toggle-cacse`

This migration has been generated by nampdn at 6/12/2020, 11:19:24 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200612231541-update-db-schema-optional..20200612231924-rename-group-org-toggle-cacse
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource DS {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider      = "prisma-client-js"
@@ -56,9 +56,9 @@
   createdAt   DateTime          @default(now())
   updatedAt   DateTime          @updatedAt @default(now())
   leader      Profile?          @relation("GroupLeader", fields: [leaderId], references: [id])
   leaderId    String?
-  Org         Org?              @relation(fields: [orgId], references: [id])
+  org         Org?              @relation(fields: [orgId], references: [id])
   orgId       String?
   attendances Attendance[]      @relation("AttendanceGroup")
   enrollment  GroupEnrollment[]
 }
```

