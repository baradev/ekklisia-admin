import { db } from 'src/lib/db'
import { remapRelationFields } from 'src/lib/helpers'

export const profiles = () => {
  return db.profile.findMany()
}

export const profile = ({ id }) => {
  return db.profile.findOne({
    where: { id },
  })
}

export const createProfile = ({ input }) => {
  const patchedInput = remapRelationFields(input, {
    orgId: 'org'
  })
  return db.profile.create({
    data: patchedInput,
  })
}

export const updateProfile = ({ id, input }) => {
  return db.profile.update({
    data: input,
    where: { id },
  })
}

export const deleteProfile = ({ id }) => {
  return db.profile.delete({
    where: { id },
  })
}

export const Profile = {
  org: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).org(),
  groups: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).groups(),
  groups: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).groups(),
  attendances: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).attendances(),
  attendances: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).attendances(),
  users: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).users(),
  groupEnrollments: (_obj, { root }) => db.profile.findOne({ where: { id: root.id } }).groupEnrollments(),
}
