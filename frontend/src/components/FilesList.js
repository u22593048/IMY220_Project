import PropTypes from "prop-types";

export default function FilesList({ files=[] }){
  return (
    <section className="card card-pad grid">
      <div className="flex between center">
        <h3 className="m0">Files</h3>
        <button className="btn">Upload…</button>
      </div>
      <ul className="list">
        {files.map(f => (
          <li key={f} className="file-item">
            <span className="file-name">{f}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
FilesList.propTypes={ files:PropTypes.arrayOf(PropTypes.string) };
