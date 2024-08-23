import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordService } from '@api/services/word.service';
import {
  IconComponent,
  Types,
} from './components/icons/theater-icons.component';

@Component({
  selector: 'theater-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IconComponent],
  providers: [DatePipe, UpperCasePipe, WordService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  Types = Types;
  public isDark = false;
  constructor() {
    // this.toggleTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark');
  }
}
