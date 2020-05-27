# Migration `20200527081450-init`

This migration has been generated by nampdn at 5/27/2020, 8:14:50 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "quaint"."User" (
"email" TEXT NOT NULL  ,"id" TEXT NOT NULL  ,"name" TEXT   ,"password" TEXT NOT NULL  ,"permission" INTEGER NOT NULL  ,"profileId" TEXT NOT NULL  ,
    PRIMARY KEY ("id"),FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."Profile" (
"birthday" DATE   ,"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,"dayOfBirth" INTEGER   ,"email" TEXT   ,"facebookId" TEXT   ,"fullName" TEXT NOT NULL  ,"gender" TEXT   ,"id" TEXT NOT NULL  ,"joinDate" DATE   ,"monthOfBirth" INTEGER   ,"oldId" TEXT   ,"orgId" TEXT   ,"phoneNumber" TEXT   ,"slug" TEXT   ,"updatedAt" DATE NOT NULL  ,"yearOfBirth" INTEGER   ,
    PRIMARY KEY ("id"),FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE SET NULL ON UPDATE CASCADE)

CREATE TABLE "quaint"."Group" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,"endAt" DATE   ,"id" TEXT NOT NULL  ,"leaderId" TEXT   ,"name" TEXT NOT NULL  ,"orgId" TEXT   ,"slug" TEXT   ,"stage" TEXT NOT NULL  ,"startAt" DATE   ,"updatedAt" DATE NOT NULL  ,"year" INTEGER   ,
    PRIMARY KEY ("id"),FOREIGN KEY ("leaderId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE SET NULL ON UPDATE CASCADE)

CREATE TABLE "quaint"."GroupEnrollment" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,"groupId" TEXT NOT NULL  ,"profileId" TEXT NOT NULL  ,"updatedAt" DATE NOT NULL  ,
    PRIMARY KEY ("groupId","profileId"),FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."Org" (
"id" TEXT NOT NULL  ,"name" TEXT NOT NULL  ,
    PRIMARY KEY ("id"))

CREATE TABLE "quaint"."Activity" (
"color" TEXT   ,"id" TEXT NOT NULL  ,"name" TEXT NOT NULL  ,"orgId" TEXT NOT NULL  ,"slug" TEXT NOT NULL  ,
    PRIMARY KEY ("id"),FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."Schedule" (
"activityId" TEXT NOT NULL  ,"date" DATE NOT NULL  ,"id" TEXT NOT NULL  ,
    PRIMARY KEY ("id"),FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."Attendance" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,"groupId" TEXT NOT NULL  ,"id" TEXT NOT NULL  ,"scheduleId" TEXT NOT NULL  ,"slug" TEXT NOT NULL  ,"status" TEXT NOT NULL  ,"updatedAt" DATE NOT NULL  ,
    PRIMARY KEY ("id"),FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."_GroupMembers" (
"A" TEXT NOT NULL  ,"B" TEXT NOT NULL  ,FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."_AttendanceAttendee" (
"A" TEXT NOT NULL  ,"B" TEXT NOT NULL  ,FOREIGN KEY ("A") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."_AttendanceAbsentee" (
"A" TEXT NOT NULL  ,"B" TEXT NOT NULL  ,FOREIGN KEY ("A") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE UNIQUE INDEX "quaint"."User.email" ON "User"("email")

CREATE UNIQUE INDEX "quaint"."Profile.oldId" ON "Profile"("oldId")

CREATE UNIQUE INDEX "quaint"."Profile.slug" ON "Profile"("slug")

CREATE UNIQUE INDEX "quaint"."Group.slug" ON "Group"("slug")

CREATE UNIQUE INDEX "quaint"."Activity.slug" ON "Activity"("slug")

CREATE UNIQUE INDEX "quaint"."Attendance.slug" ON "Attendance"("slug")

CREATE UNIQUE INDEX "quaint"."_GroupMembers_AB_unique" ON "_GroupMembers"("A","B")

CREATE  INDEX "quaint"."_GroupMembers_B_index" ON "_GroupMembers"("B")

CREATE UNIQUE INDEX "quaint"."_AttendanceAttendee_AB_unique" ON "_AttendanceAttendee"("A","B")

CREATE  INDEX "quaint"."_AttendanceAttendee_B_index" ON "_AttendanceAttendee"("B")

CREATE UNIQUE INDEX "quaint"."_AttendanceAbsentee_AB_unique" ON "_AttendanceAbsentee"("A","B")

CREATE  INDEX "quaint"."_AttendanceAbsentee_B_index" ON "_AttendanceAbsentee"("B")

PRAGMA "quaint".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200527081450-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,118 @@
+datasource DS {
+  provider = "sqlite"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider      = "prisma-client-js"
+  binaryTargets = env("BINARY_TARGET")
+}
+
+// Define your own datamodels here and run `yarn redwood db save` to create
+// migrations for them.
+// TODO: Please remove the following example:
+model User {
+  id         String  @default(cuid()) @id
+  email      String  @unique
+  password   String
+  permission Int
+  name       String?
+  profile    Profile @relation("UserProfile", fields: [profileId], references: [id])
+  profileId  String
+}
+
+model Profile {
+  id              String            @default(cuid()) @id
+  fullName        String
+  gender          String?
+  oldId           String?           @unique
+  slug            String?           @unique
+  email           String?
+  facebookId      String?
+  phoneNumber     String?
+  birthday        DateTime?
+  joinDate        DateTime?
+  dayOfBirth      Int?
+  monthOfBirth    Int?
+  yearOfBirth     Int?
+  org             Org?              @relation("ProfileOrg", fields: [orgId], references: [id])
+  createdAt       DateTime          @default(now())
+  updatedAt       DateTime          @updatedAt
+  leader          Group[]           @relation("GroupLeader")
+  member          Group[]           @relation("GroupMembers", references: [id])
+  attendee        Attendance[]      @relation("AttendanceAttendee", references: [id])
+  absentee        Attendance[]      @relation("AttendanceAbsentee", references: [id])
+  orgId           String?
+  User            User[]            @relation("UserProfile")
+  GroupEnrollment GroupEnrollment[]
+}
+
+model Group {
+  id              String            @default(cuid()) @id
+  name            String
+  slug            String?           @unique
+  year            Int?
+  stage           String
+  members         Profile[]         @relation("GroupMembers", references: [id])
+  startAt         DateTime?
+  endAt           DateTime?
+  createdAt       DateTime          @default(now())
+  updatedAt       DateTime          @updatedAt
+  leader          Profile?          @relation("GroupLeader", fields: [leaderId], references: [id])
+  leaderId        String?
+  GroupEnrollment GroupEnrollment[]
+  Org             Org?              @relation(fields: [orgId], references: [id])
+  orgId           String?
+  Attendance      Attendance[]      @relation("AttendanceGroup")
+}
+
+model GroupEnrollment {
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  group     Group    @relation(fields: [groupId], references: [id])
+  profile   Profile  @relation(fields: [profileId], references: [id])
+  groupId   String
+  profileId String
+
+  @@id([groupId, profileId])
+}
+
+model Org {
+  id         String     @default(cuid()) @id
+  name       String
+  groups     Group[]
+  activities Activity[] @relation("OrgActivity")
+  Profile    Profile[]  @relation("ProfileOrg")
+}
+
+model Activity {
+  id       String     @default(cuid()) @id
+  slug     String     @unique
+  name     String
+  color    String?
+  org      Org        @relation("OrgActivity", fields: [orgId], references: [id])
+  orgId    String
+  Schedule Schedule[] @relation("ScheduleActivity")
+}
+
+model Schedule {
+  id          String       @default(cuid()) @id
+  attendances Attendance[] @relation("AttendanceSchedule")
+  date        DateTime
+  activity    Activity     @relation("ScheduleActivity", fields: [activityId], references: [id])
+  activityId  String
+}
+
+model Attendance {
+  id         String    @default(cuid()) @id
+  slug       String    @unique
+  status     String
+  createdAt  DateTime  @default(now())
+  updatedAt  DateTime  @updatedAt
+  group      Group     @relation("AttendanceGroup", fields: [groupId], references: [id])
+  schedule   Schedule  @relation("AttendanceSchedule", fields: [scheduleId], references: [id])
+  attendees  Profile[] @relation("AttendanceAttendee", references: [id])
+  absentees  Profile[] @relation("AttendanceAbsentee", references: [id])
+  groupId    String
+  scheduleId String
+}
```

