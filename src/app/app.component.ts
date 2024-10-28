import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsignacionesWordService } from '@api/services/asignaciones-word.service';
import { PlanoWordService } from '@api/services/plano-word.service';
import {
  IconComponent,
  Types,
} from './components/icons/theater-icons.component';

@Component({
  selector: 'theater-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IconComponent],
  providers: [
    DatePipe,
    UpperCasePipe,
    AsignacionesWordService,
    PlanoWordService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  Types = Types;
  public isDark = false;

  constructor() {
    (JSON.parse(localStorage.getItem('darkmode') || 'false') as Boolean) !==
    this.isDark
      ? this.toggleTheme()
      : null;
  }

  toggleTheme(): void {
    localStorage.setItem('darkmode', String(!this.isDark));
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark');
  }
}
