import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.html',
  styleUrls: ['./measurement-form.scss']
})
export class MeasurementFormComponent {
  @Output() newMeasurement = new EventEmitter<any>();

  formData = {
    source: '',
    phase: '',
    u: '',
    i: '',
    p: '',
    q: '',
    cos: ''
  };

  addMeasurement() {
    // Simple validation
    if (!this.formData.source.trim()) {
      alert('Пожалуйста, введите источник');
      return;
    }

    // Текущая дата и время
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const date = `${day}.${month}.${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    const newMeasurement = {
      date,
      time,
      source: this.formData.source,
      phase: this.formData.phase || '-',
      u: this.formData.u || '-',
      i: this.formData.i || '-',
      p: this.formData.p || '-',
      q: this.formData.q || '-',
      cos: this.formData.cos || '-'
    };

    this.newMeasurement.emit(newMeasurement);

    // Reset form
    this.formData = {
      source: '',
      phase: '',
      u: '',
      i: '',
      p: '',
      q: '',
      cos: ''
    };
  }

  resetForm() {
    this.formData = {
      source: '',
      phase: '',
      u: '',
      i: '',
      p: '',
      q: '',
      cos: ''
    };
  }
}
