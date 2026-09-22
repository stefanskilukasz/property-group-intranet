// Standalone preview harness — NOT part of the SPFx build. Renders the same
// IntranetShell component tree outside SharePoint so it can be checked in a
// plain browser without a trusted dev certificate. Run with `vite` from
// this project's root (see preview/README.md).
import * as React from 'react';
import * as ReactDom from 'react-dom';
import IntranetShell from '../src/webparts/intranetShell/components/IntranetShell';

const element = React.createElement(IntranetShell, {
  description: '',
  isDarkTheme: false,
  environmentMessage: 'Podgląd lokalny (poza SharePoint)',
  userDisplayName: 'Łukasz Stefański'
});

ReactDom.render(element, document.getElementById('root'));
