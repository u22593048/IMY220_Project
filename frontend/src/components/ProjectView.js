import PropTypes from "prop-types";

export default function ProjectView({ project }){
  return (
    <section className="card card-pad grid">
      <div className="flex between center">
        <h2 className="m0">{project.name}</h2>
        <span className="badge">{project.version ?? "v0.1"}</span>
      </div>
      <p className="mt1">{project.description}</p>
      {project.tags?.length ? (
        <div className="badges mt1">
          {project.tags.map(t => <span key={t} className="badge">#{t}</span>)}
        </div>
      ) : null}
    </section>
  );
}
ProjectView.propTypes={ project:PropTypes.object.isRequired };
