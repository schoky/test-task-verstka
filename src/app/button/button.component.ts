import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-button',
  template: `
    <button [class]='classes' [disabled]='disabled' (click)='onClick()'>
      {{ label }}
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = '';

  @Input() classes: string = '';

  @Input() disabled: boolean = false;

  // Create an Output property to export the disabled state

  @Output() disabledChange = new EventEmitter<boolean>();

  onClick() {
    this.updateDisabledState(!this.disabled);
  }

  // Method to update the disabled state and emit the change

  updateDisabledState(disabled: boolean) {
    this.disabled = disabled;

    this.disabledChange.emit(disabled);
  }
}
