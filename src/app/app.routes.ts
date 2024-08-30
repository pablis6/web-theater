import { Routes } from '@angular/router';
import { PlanoComponent } from '@components/plano/plano.component';
import { RepresentacionesComponent } from '@components/representaciones/representaciones.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'representaciones',
  },
  {
    path: 'representaciones',
    children: [
      {
        path: '', // /representaciones
        component: RepresentacionesComponent,
      },
      {
        path: ':representacionId', // /representaciones/:id
        component: PlanoComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'representaciones',
  },
];
