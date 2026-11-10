import React from 'react';
import {PageHead,Btn} from './LearningUI.jsx';

export function NotFound(){return <div className="content narrow"><PageHead eyebrow="PAGE INTROUVABLE" title="Oups, ce chemin n’existe pas." description="Revenez à l’accueil pour reprendre votre exploration."/><Btn to="/">Retour à l’accueil</Btn></div>}
