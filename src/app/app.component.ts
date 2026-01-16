import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MeasurementFormComponent } from './measurement-form/measurement-form.component';
import { ButtonComponent } from './button/button.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';

// js-solutions
import '../js/modules/jquery.js';
import '../js/modules/collapse.js';
import '../js/modules/resizer.js';

@Component({
  standalone: true,

  imports: [
    NgFor,
    ButtonComponent,
    HeaderComponent,
    MeasurementFormComponent,
    DialogComponent,
    DialogFormComponent,
    DialogEditComponent,
  ],

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './header/header.component.scss',
    './button/button.component.scss',
    './dialog/dialog.component.scss',
    './dialog-form/dialog-form.component.scss',
    './dialog-edit/dialog-edit.component.scss',
  ],
})
export class AppComponent {
  title = 'monitor-app';

  // Data of the table headers
  measurementHeaders = [
    'Дата',
    'Время',
    'Источник',
    'Фаза',
    'U, kB',
    'I, A',
    'Р, МВт',
    'Q, Мвар',
    'coѕ ф',
  ];

  // Data of the table
  measurements = [
    {
      id: 1,
      date: '30.07.2022',
      time: '10:15:23',
      source: 'Оператор',
      phase: '-',
      u: '-',
      i: '-',
      p: '-',
      q: '-',
      cos: '-',
      selected: false,
    },

    {
      id: 2,
      date: '30.07.2022',
      time: '10:08:44',
      source: 'Оператор',
      phase: '-',
      u: '-',
      i: '-',
      p: '-',
      q: '-',
      cos: '-',
      selected: false,
    },

    {
      id: 3,
      date: '29.07.2022',
      time: '15:08:44',
      source: 'Оператор',
      phase: 'a',
      u: '1',
      i: '0.5',
      p: '3',
      q: '0.7',
      cos: '0.67',
      selected: false,
    },

    {
      id: 4,
      date: '12.06.2022',
      time: '10:28:02',
      source: 'SCADA',
      phase: 'b',
      u: '1',
      i: '0.6',
      p: '2.756',
      q: '0.9',
      cos: '0.83',
      selected: false,
    },

    {
      id: 5,
      date: '05.05.2022',
      time: '13:56:39',
      source: 'АСКУЭ',
      phase: 'c',
      u: '1.2',
      i: '0.5',
      p: '3.143',
      q: '0.78',
      cos: '0.67',
      selected: false,
    },

    {
      id: 6,
      date: '05.05.2022',
      time: '13:56:39',
      source: 'АСКУЭ',
      phase: 'c',
      u: '1.2',
      i: '0.5',
      p: '3.143',
      q: '0.78',
      cos: '0.67',
      selected: false,
    },

    {
      id: 7,
      date: '02.03.2022',
      time: '17:43:51',
      source: 'Регистратор',
      phase: 'ab',
      u: '1.1',
      i: '0.4',
      p: '3.343',
      q: '0.76',
      cos: '0.65',
      selected: false,
    },
  ];

  // Data of the list headers
  listHeaders = ['Наименование', 'U ном.'];

  // Data of the list
  listData = [
    { name: 'PTCH\\HH-1', u: '6' },

    { name: 'PTCH\\HH-2', u: '6' },

    { name: 'БТ1\\НН-2', u: '10.5' },

    { name: 'БТ-1\\ВН', u: '110' },
  ];

  // list of substations
  substations: any = [
    { id: 0, value: 'Выберите подстанцию' },
    { id: 1, value: 'ТЭЦ ПГУ ГСР Энерго' },
    { id: 2, value: 'Подстанция 2' },
    { id: 3, value: 'Подстанция 3' },
    { id: 4, value: 'Подстанция 4' },
    { id: 5, value: 'Подстанция 5' },
  ];

  // list of equipment
  equipment: any = [
    { name: '', value: 'Выберите оборудование' },
    { name: 'tr1', value: 'Трансформатор 1' },
    { name: 'tr2', value: 'Трансформатор 2' },
    { name: 'tr3', value: 'Трансформатор 3' },
    { name: 'tr4', value: 'Трансформатор 4' },
    { name: 'tr5', value: 'Трансформатор 5' },
  ];

  // list of equipment types
  equipmentTypes: any = [
    { name: '', value: 'Выберите тип' },
    { name: 'transformator', value: 'Трансформаторы' },
    { name: 'generator', value: 'Генераторы' },
  ];

  // list of RU
  ruValues: any = [
    { name: '', value: 'Выберите РУ' },
    { name: 'RU1', value: 'РУ 1' },
    { name: 'RU2', value: 'РУ 2' },
  ];

  // Set the vars
  selectedMeasurement: any;
  selectedMeasurements = this.measurements;
  selectAll: boolean = false;
  selectedSubstation: any = this.substations[0].value;
  selectedEquipmentType: string = 'transformator';
  selectedRU: string = 'RU1';

  // Sort
  sortDirection = 'asc';

  sortedColumn = '';

  // Selected substations
  selectSubstation(substation: any) {
    this.selectedSubstation = substation;
    this.closeDialog();
  }

  toggleSort(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;

      this.sortDirection = 'asc';
    }

    this.sortMeasurements();
  }

  sortMeasurements() {
    if (this.sortedColumn === 'date') {
      this.measurements.sort((a, b) => {
        const dateA = a.date.split('.').map(Number);
        const dateB = b.date.split('.').map(Number);
        if (this.sortDirection === 'asc') {
          if (dateA[2] !== dateB[2]) return dateA[2] - dateB[2];
          if (dateA[1] !== dateB[1]) return dateA[1] - dateB[1];
          return dateA[0] - dateB[0]; // day
        } else {
          if (dateA[2] !== dateB[2]) return dateB[2] - dateA[2];
          if (dateA[1] !== dateB[1]) return dateB[1] - dateA[1];
          return dateB[0] - dateA[0]; // day
        }
      });
    }
  }

  // Check if a measurement is checked
  isChecked(measurement: any) {
    return measurement.checked;
  }

  // Toggle checked state of a measurement
  toggleSelect(measurement: any) {
    measurement.selected
      ? (measurement.selected = false)
      : (measurement.selected = true);

    return this.selectedMeasurement;
  }

  // Toggle checked state for all measurements
  toggleSelectAll(event: any) {
    const selectAll = event.target.checked;

    this.measurements.forEach((m) => (m.selected = selectAll));
  }

  // add New Measurement
  addNewMeasurement(measurement: any) {
    this.measurements.push(measurement);
  }

  // Select Measurement
  selectMeasurement(measurement: any) {
    this.selectedMeasurement = measurement;
  }

  // get Selected Measurement
  getSelectedMeasurementId() {
    return this.selectedMeasurement?.id;
  }

  // edit Measurement fuinction
  editMeasurement() {
    this.selectedMeasurements = this.measurements.filter((m) => m.selected);
    if (
      this.selectedMeasurements.length > 0 &&
      this.selectedMeasurements.length < 2
    ) {
      this.openDialogEdit();
    }
  }

  // Save Current Selected Measurement
  @ViewChildren('measurementInput') measurementInputs!: QueryList<ElementRef>;

  saveMeasurementChanges(measurement: any) {
    measurement.selected = false;

    const inputValues = this.measurementInputs.map(
      (input) => input.nativeElement.value
    );

    if (inputValues.length > 0) {
      this.selectedMeasurements.forEach((measurement, measurementIndex) => {
        const inputValue = inputValues[measurementIndex];
        measurement = {
          ...measurement,
          source: inputValue,
          phase: inputValue,
          u: inputValue,
          i: inputValue,
          p: inputValue,
          q: inputValue,
          cos: inputValue,
        };
      });
    }

    console.log('Selected measurements updated:', this.selectedMeasurements);
  }

  // saveMeasurementChanges(measurement: any) {
  //   measurement.selected = false;

  //   const inputValues = this.measurementInputs.map(
  //     (input) => input.nativeElement.value
  //   );

  //   if (inputValues.length > 0) {
  //     this.selectedMeasurements.forEach((measurement, measurementIndex) => {
  //       const inputValue = inputValues[measurementIndex];

  //       measurement.source = inputValue;
  //       measurement.phase = inputValue;
  //       measurement.u = inputValue;
  //       measurement.i = inputValue;
  //       measurement.p = inputValue;
  //       measurement.q = inputValue;
  //       measurement.cos = inputValue;
  //     });
  //   }

  //   console.log('Selected measurements updated:', this.selectedMeasurements);
  // }

  // remove Measurement
  removeMeasurement() {
    this.measurements = this.measurements.filter((m) => !m.selected);
  }

  // check dialogs
  @ViewChild('dialog') dialog: DialogComponent | undefined;
  @ViewChild('dialogForm') dialogForm: DialogFormComponent | undefined;
  @ViewChild('dialogEdit') dialogEdit: DialogEditComponent | undefined;

  // callback dialogs
  openDialog() {
    if (this.dialog) {
      this.dialog.open();
    }
  }

  openDialogForm() {
    if (this.dialogForm) {
      this.dialogForm.open();
    }
  }

  openDialogEdit() {
    if (this.dialogEdit) {
      this.dialogEdit.open();
    }
  }

  closeDialog() {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  closeDialogForm() {
    if (this.dialogForm) {
      this.dialogForm.close();
    }
  }

  closeDialogEdit() {
    if (this.dialogEdit) {
      this.dialogEdit.close();
    }
  }
}
