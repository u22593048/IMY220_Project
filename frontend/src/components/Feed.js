import React from 'react';
import ProjectPreview from './ProjectPreview';

export default function Feed({ items }) {
  return (
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
      {items.map(p => <ProjectPreview key={p.id} project={p} />)}
    </section>
  );
}
