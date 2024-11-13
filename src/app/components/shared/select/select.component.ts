import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent, Types } from '../../icons/theater-icons.component';

@Component({
  selector: 'theater-select',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './select.component.html',
})
export class SelectComponent {
  @Input() selected?: string;
  @Input() filterMode?: boolean = false;

  public readonly Types = Types;

  public isOpen = false;

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
