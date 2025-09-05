import React from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function ProjectPreview({ project }){
  return (
    <article className="card card-pad">
      <div className="flex between center">
        <h3 className="m0">{project.name}</h3>
        <span className="badge">{project.type ?? "project"}</span>
      </div>
      <p className="mt1">{project.description}</p>
      {project.tags?.length ? (
        <div className="badges mt1">
          {project.tags.map(t => <span className="badge" key={t}>#{t}</span>)}
        </div>
      ) : null}
      <div className="flex mt2">
        <Link className="btn btn-primary" to={`/project/${project.id}`}>Open</Link>
        <Link className="btn" to={`/project/${project.id}/edit`}>Edit</Link>
      </div>
    </article>
  );
}
ProjectPreview.propTypes={ project:PropTypes.shape({
  id:PropTypes.string.isRequired, name:PropTypes.string.isRequired,
  description:PropTypes.string, tags:PropTypes.arrayOf(PropTypes.string), type:PropTypes.string
}).isRequired };
