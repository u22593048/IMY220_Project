import PropTypes from "prop-types";
import ProjectPreview from "./ProjectPreview";

export default function ProjectList({ projects = [] }){
  return (
    <div className="grid grid-3">
      {projects.map(p => <ProjectPreview key={p._id} project={p} />)}
    </div>
  );
}
ProjectList.propTypes = { projects: PropTypes.array.isRequired };
