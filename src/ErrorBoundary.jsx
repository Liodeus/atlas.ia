import React from 'react';

export class ErrorBoundary extends React.Component{constructor(props){super(props);this.state={error:false}}static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<div className="content" role="alert"><h1>Cette page n’a pas pu s’afficher.</h1><p>Votre progression locale est conservée. Revenez à l’accueil pour continuer.</p><a className="button" href={import.meta.env.BASE_URL}>Retour à l’accueil</a></div>:this.props.children}}
