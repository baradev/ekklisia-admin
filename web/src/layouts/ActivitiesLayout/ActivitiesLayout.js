import { Link, routes } from '@redwoodjs/router'

const ActivitiesLayout = (props) => {
  return (
    <div className="rw-scaffold">
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link
            to={routes.activities()}
            className="rw-link"
          >
            Activities
          </Link>
        </h1>
        <Link
          to={routes.newActivity()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New Activity
        </Link>
      </header>
      <main className="rw-main">{props.children}</main>
    </div>
  )
}

export default ActivitiesLayout
