import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum Types {
  delete = 'delete',
  edit = 'edit',
  download = 'download',
  add = 'add',
  close = 'close',
  sun = 'sun',
  moon = 'moon',
  arrow = 'arrow',
  check = 'check',
  theater = 'theater',
  seat = 'seat',
  doubleArrow = 'doubleArrow',
}

@Component({
  selector: 'theater-icon',
  standalone: true,
  templateUrl: './theater-icons.component.html',
  imports: [CommonModule],
})
export class IconComponent {
  @Input() type?: Types;
  @Input() width?: number;

  public Types = Types;
}
