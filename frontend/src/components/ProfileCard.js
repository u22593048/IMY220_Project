import PropTypes from "prop-types";

export default function ProfileCard({ user }){
  return (
    <aside className="card card-pad">
      <div className="flex center">
        <img className="avatar" src={user.avatar ?? "/assets/images/logo.svg"} alt="" />
        <div>
          <h3 className="m0">{user.name}</h3>
          <div className="help">{user.handle}</div>
        </div>
      </div>
      <div className="badges mt2">
        <span className="badge">{user.projectsCount ?? 2} projects</span>
        <span className="badge">{user.friendsCount ?? 3} friends</span>
      </div>
    </aside>
  );
}
ProfileCard.propTypes={ user:PropTypes.shape({
  name:PropTypes.string.isRequired, handle:PropTypes.string.isRequired, avatar:PropTypes.string
}).isRequired };
