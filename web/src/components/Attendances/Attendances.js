import { useMutation } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

const DELETE_ATTENDANCE_MUTATION = gql`
  mutation DeleteAttendanceMutation($id: String!) {
    deleteAttendance(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

const AttendancesList = ({ attendances }) => {
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE_MUTATION)

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete attendance ' + id + '?')) {
      deleteAttendance({ variables: { id }, refetchQueries: ['ATTENDANCES'] })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Nhóm</th>
            <th>Hoạt động</th>
            <th>Nộp lúc</th>
            <th>Cập nhật lần cuối</th>
            <th>Hiện diện / Vắng mặt</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance) => (
            <tr key={attendance.id}>
              <td>{truncate(attendance.group.name)}</td>
              <td>{truncate(attendance.schedule.activity.name)}</td>
              <td>{timeTag(attendance.createdAt)}</td>
              <td>{timeTag(attendance.updatedAt)}</td>
              <td>
                {attendance.attendees.length}/{attendance.absentees.length}
              </td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.attendance({ id: attendance.id })}
                    title={'Show attendance ' + attendance.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editAttendance({ id: attendance.id })}
                    title={'Edit attendance ' + attendance.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    title={'Delete attendance ' + attendance.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(attendance.id)}
                  >
                    Delete
                  </a>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendancesList
