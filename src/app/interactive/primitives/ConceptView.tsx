import { useId, type ReactNode } from 'react';

export function ConceptView({title,description,children,height=280}:{title:string;description:string;children:ReactNode;height?:number}){
 const id=useId();return <svg className="concept-view" viewBox={`0 0 440 ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}><title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}</svg>;
}

export function RelativeBars({items}:{items:readonly {label:string;value:number;detail:string}[]}){
 return <div className="relative-bars" aria-label="상대 비교">{items.map(item=><div key={item.label}><span>{item.label}</span><div className="relative-bar-track"><i style={{width:`${Math.max(8,item.value)}%`}}/></div><strong>{item.detail}</strong></div>)}</div>;
}

export function ConceptExplanation({heading,children}:{heading:string;children:ReactNode}){return <div className="concept-explanation"><strong>{heading}</strong>{children}</div>}
