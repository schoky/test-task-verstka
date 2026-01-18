import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {
  MeasurementFormComponent
} from './measurement-form/measurement-form.component';
import {DialogComponent} from './dialog/dialog.component';
import {DialogForm} from './dialog-form/dialog-form';
import {DialogEdit} from './dialog-edit/dialog-edit';
import {DataService, Measurement, Substation} from './services/data.service';

import '../js/modules/jquery.js';
import '../js/modules/collapse.js';
import '../js/modules/resizer.js';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MeasurementFormComponent,
    DialogComponent,
    DialogForm,
    DialogEdit,
    FormsModule
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: [
    './app.scss',
    './header/header.scss',
    './button/button.scss',
    './dialog/dialog.scss',
    './dialog-form/dialog-form.scss',
    './dialog-edit/dialog-edit.scss'
  ]
})
export class App implements OnInit {
  title = 'monitor-app';

  // Data
  measurementHeaders = [
    'Дата',
    'Время',
    'Источник',
    'Фаза',
    'U, kB',
    'I, A',
    'Р, МВт',
    'Q, Мвар',
    'coѕ ф'
  ];
  measurements: Measurement[] = [];
  listData = [
    {name: 'PTCH\\HH-1', u: '6'},
    {name: 'PTCH\\HH-2', u: '6'},
    {name: 'БТ1\\НН-2', u: '10.5'},
    {name: 'БТ-1\\ВН', u: '110'}
  ];
  substations: Substation[] = [];
  selectedSubstation: Substation = {id: 0, value: 'Выберите подстанцию'};
  equipment = [
    {name: '', value: 'Выберите оборудование'},
    {name: 'tr1', value: 'Трансформатор 1'},
    {name: 'tr2', value: 'Трансформатор 2'},
    {name: 'tr3', value: 'Трансформатор 3'},
    {name: 'tr4', value: 'Трансформатор 4'},
    {name: 'tr5', value: 'Трансформатор 5'}
  ];
  equipmentTypes = [
    {name: '', value: 'Выберите тип'},
    {name: 'transformator', value: 'Трансформаторы'},
    {name: 'generator', value: 'Генераторы'}
  ];
  ruValues = [
    {name: '', value: 'Выберите РУ'},
    {name: 'RU1', value: 'РУ 1'},
    {name: 'RU2', value: 'РУ 2'}
  ];

  // State
  selectedMeasurement: Measurement | null = null;
  selectAll: boolean = false;
  isGroupedByDate: boolean = false; // Флаг для группировки по дате
  activeTab: string = 'equipment';
  viewMode: string = 'list';

  // Dialog inputs for editing
  editFormData = {
    date: '',
    time: '',
    source: '',
    phase: '',
    u: '',
    i: '',
    p: '',
    q: '',
    cos: ''
  };

  // Dialogs
  @ViewChild('dialog') dialog: DialogComponent | undefined;
  @ViewChild('dialogForm') dialogForm: DialogForm | undefined;
  @ViewChild('dialogEdit') dialogEdit: DialogEdit | undefined;
  @ViewChild('confirmDialog') confirmDialog: DialogComponent | undefined;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getMeasurements().subscribe(measurements => {
      this.measurements = measurements;
      this.sortMeasurements(); // Сортировка при загрузке
    });
    this.dataService.getSubstations().subscribe(substations => {
      this.substations = substations;
    });
    this.dataService.getSelectedSubstation().subscribe(substation => {
      this.selectedSubstation = substation;
    });
    this.dataService.getActiveTab().subscribe(tab => {
      this.activeTab = tab;
    });
    this.dataService.getViewMode().subscribe(mode => {
      this.viewMode = mode;
    });
  }

  // Helper methods for template
  hasSelectedMeasurements(): boolean {
    return this.measurements.some(m => m.selected);
  }

  getSelectedMeasurementsCount(): number {
    return this.measurements.filter(m => m.selected).length;
  }

  hasSingleSelected(): boolean {
    return this.getSelectedMeasurementsCount() === 1;
  }

  // Методы для проверенных замеров
  hasVerifiedMeasurements(): boolean {
    return this.measurements.some(m => m.verified);
  }

  getVerifiedMeasurementsCount(): number {
    return this.measurements.filter(m => m.verified).length;
  }

  resetAllVerifications(): void {
    // Сброс всех проверенных замеров
    const updates = this.measurements
    .filter(m => m.verified)
    .map(m => ({id: m.id, changes: {verified: false}}));

    updates.forEach(({id, changes}) => {
      this.dataService.updateMeasurement(id, changes);
    });
  }

  // Сортировка по дате
  toggleGroupByDate(): void {
    this.isGroupedByDate = !this.isGroupedByDate;
    this.sortMeasurements();
  }

  sortMeasurements(): void {
    if (this.isGroupedByDate) {
      // Сортировка по убыванию даты (самые свежие первыми)
      this.measurements.sort((a, b) => {
        // Преобразуем дату в формат для сравнения: гггг-мм-дд
        const dateA = this.parseDateToTimestamp(a.date, a.time);
        const dateB = this.parseDateToTimestamp(b.date, b.time);

        // Сортируем по убыванию (новые первыми)
        return dateB - dateA;
      });
    } else {
      // Сортировка по ID (оригинальный порядок)
      this.measurements.sort((a, b) => a.id - b.id);
    }
  }

  private parseDateToTimestamp(dateStr: string, timeStr: string): number {
    try {
      // Формат даты: дд.мм.гггг
      const [day, month, year] = dateStr.split('.').map(Number);
      // Формат времени: чч:мм:сс
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);

      return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    } catch (error) {
      console.error('Ошибка парсинга даты:', error);
      return 0;
    }
  }

  // Substation selection
  selectSubstation(substationValue: string): void {
    const substation = this.substations.find(s => s.value === substationValue);
    if (substation) {
      this.dataService.setSelectedSubstation(substation);
      this.closeDialog();
    }
  }

  // Tabs and view modes
  setActiveTab(tab: string): void {
    this.dataService.setActiveTab(tab);
  }

  setViewMode(mode: string): void {
    this.dataService.setViewMode(mode);
  }

  // Selection
  isChecked(measurement: Measurement): boolean {
    return measurement.selected;
  }

  toggleSelect(measurement: Measurement): void {
    this.dataService.updateMeasurement(measurement.id, {selected: !measurement.selected});
  }

  toggleSelectAll(event: any): void {
    const selectAll = event.target.checked;
    this.dataService.toggleSelectAll(selectAll);
  }

  // Add new measurement
  addNewMeasurement(measurementData: any): void {
    const newMeasurement: Omit<Measurement, 'id' | 'selected' | 'verified'> = {
      date: measurementData.date || this.getCurrentDate(),
      time: measurementData.time || this.getCurrentTime(),
      source: measurementData.source,
      phase: measurementData.phase,
      u: measurementData.u,
      i: measurementData.i,
      p: measurementData.p,
      q: measurementData.q,
      cos: measurementData.cos
    };
    this.dataService.addMeasurement(newMeasurement);
    this.closeDialogForm();
  }

  // Edit measurement
  editMeasurement(): void {
    const selected = this.measurements.filter(m => m.selected);
    if (selected.length === 1) {
      this.selectedMeasurement = selected[0];
      // Заполняем форму данными
      this.editFormData = {
        date: this.selectedMeasurement.date,
        time: this.selectedMeasurement.time,
        source: this.selectedMeasurement.source,
        phase: this.selectedMeasurement.phase,
        u: this.selectedMeasurement.u,
        i: this.selectedMeasurement.i,
        p: this.selectedMeasurement.p,
        q: this.selectedMeasurement.q,
        cos: this.selectedMeasurement.cos
      };
      this.openDialogEdit();
    }
  }

  saveMeasurementChanges(): void {
    if (!this.selectedMeasurement) return;

    const updated: Partial<Measurement> = {
      date: this.editFormData.date,
      time: this.editFormData.time,
      source: this.editFormData.source,
      phase: this.editFormData.phase,
      u: this.editFormData.u,
      i: this.editFormData.i,
      p: this.editFormData.p,
      q: this.editFormData.q,
      cos: this.editFormData.cos,
      selected: false
    };

    this.dataService.updateMeasurement(this.selectedMeasurement.id, updated);
    this.closeDialogEdit();
  }

  // Delete measurement with confirmation
  removeMeasurement(): void {
    if (this.hasSelectedMeasurements()) {
      this.openConfirmDialog();
    }
  }

  confirmDelete(): void {
    this.dataService.deleteSelectedMeasurements();
    this.closeConfirmDialog();
  }

  // Verify buttons
  verifySelected(): void {
    this.dataService.toggleVerifySelected(true);
  }

  unverifySelected(): void {
    this.dataService.toggleVerifySelected(false);
  }

  // Dialog controls
  openDialog(): void {
    this.dialog?.open();
  }

  openDialogForm(): void {
    this.dialogForm?.open();
  }

  openDialogEdit(): void {
    this.dialogEdit?.open();
  }

  openConfirmDialog(): void {
    this.confirmDialog?.open();
  }

  closeDialog(): void {
    this.dialog?.close();
  }

  closeDialogForm(): void {
    this.dialogForm?.close();
  }

  closeDialogEdit(): void {
    this.dialogEdit?.close();
  }

  closeConfirmDialog(): void {
    this.confirmDialog?.close();
  }

  // Helpers
  getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
