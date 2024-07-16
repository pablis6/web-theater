import { Routes } from '@angular/router';
import { PlanoComponent } from './components/plano/plano.component';
import { RepresentacionesComponent } from './components/representaciones/representaciones.component';

export const routes: Routes = [
  {
    path: 'representaciones',
    component: RepresentacionesComponent,
    children: [
      {
        path: ':id', // /representaciones/:id
        component: PlanoComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'representaciones',
  },
];
