import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent {
  @Output() newMeasurement = new EventEmitter<any>();

  addMeasurement() {
    const day = new Date().getDate();
    const month = new Date().getMonth().toLocaleString();
    const year = new Date().getFullYear();
    const date = [day + '.' + month + '.' + year].toLocaleString();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();
    const time = [hours + ':' + minutes + ':' + seconds].toLocaleString();
    const source = (document.getElementById('source') as HTMLInputElement)
      .value;
    const phase = (document.getElementById('phase') as HTMLInputElement).value;
    const u = (document.getElementById('u') as HTMLInputElement).value;
    const i = (document.getElementById('i') as HTMLInputElement).value;
    const p = (document.getElementById('p') as HTMLInputElement).value;
    const q = (document.getElementById('q') as HTMLInputElement).value;
    const cos = (document.getElementById('cos') as HTMLInputElement).value;
    const selected = false;

    const newMeasurement = {
      date,
      time,
      source,
      phase,
      u,
      i,
      p,
      q,
      cos,
      selected
    };
    this.newMeasurement.emit(newMeasurement);
  }
}
