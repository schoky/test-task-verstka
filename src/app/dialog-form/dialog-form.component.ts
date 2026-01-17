import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent {
  @Input() title: string = '';
  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  closeDialog() {
    this.cancelEvent.emit();
  }

  isOpen = false;

  open(): void {
    this.isOpen = true;
    document.documentElement.classList.add('dialog-is-open');
  }

  close(): void {
    this.isOpen = false;
    document.documentElement.classList.remove('dialog-is-open');
  }

  confirm(): void {
    this.confirmEvent.emit();
    this.close();
  }

  cancel(): void {
    this.cancelEvent.emit();
    this.close();
  }
}
