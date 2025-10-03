import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function ProjectPreview({ project }){
  const tags = project.hashtags || project.tags || [];
  return (
    <article className="card card-pad">
      <div className="flex between center">
        <h3 className="m0">{project.name}</h3>
        <span className="badge">{project.type ?? "project"}</span>
      </div>
      <p className="mt1">{project.description}</p>
      {tags.length ? (
        <div className="badges mt1">
          {tags.map(t => <span className="badge" key={t}>#{t}</span>)}
        </div>
      ) : null}
      <div className="flex mt2">
        <Link className="btn btn-primary" to={`/project/${project._id}`}>Open</Link>
        <Link className="btn" to={`/project/${project._id}/edit`}>Edit</Link>
      </div>
    </article>
  );
}
ProjectPreview.propTypes = {
  project: PropTypes.object.isRequired
};
