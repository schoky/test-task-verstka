import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Measurement {
  id: number;
  date: string;
  time: string;
  source: string;
  phase: string;
  u: string;
  i: string;
  p: string;
  q: string;
  cos: string;
  selected: boolean;
  verified?: boolean;
}

export interface Substation {
  id: number;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Initial mock data
  private initialMeasurements: Measurement[] = [
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
      verified: false
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
      verified: false
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
      verified: false
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
      verified: false
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
      verified: false
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
      verified: false
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
      verified: false
    }
  ];

  private initialSubstations: Substation[] = [
    {id: 0, value: 'Выберите подстанцию'},
    {id: 1, value: 'ТЭЦ ПГУ ГСР Энерго'},
    {id: 2, value: 'Подстанция 2'},
    {id: 3, value: 'Подстанция 3'},
    {id: 4, value: 'Подстанция 4'},
    {id: 5, value: 'Подстанция 5'}
  ];

  private measurementsSubject = new BehaviorSubject<Measurement[]>([]);
  private substationsSubject = new BehaviorSubject<Substation[]>(this.initialSubstations);
  private selectedSubstationSubject = new BehaviorSubject<Substation>(this.initialSubstations[0]);
  private activeTabSubject = new BehaviorSubject<string>('equipment');
  private viewModeSubject = new BehaviorSubject<string>('list');

  constructor() {
    // Load from localStorage on service initialization
    this.loadFromLocalStorage();
  }

  // Measurements
  getMeasurements(): Observable<Measurement[]> {
    return this.measurementsSubject.asObservable();
  }

  addMeasurement(measurementData: Omit<Measurement, 'id' | 'selected' | 'verified'>): void {
    const newMeasurement: Measurement = {
      ...measurementData,
      id: this.generateId(),
      selected: false,
      verified: false
    };

    const currentMeasurements = this.measurementsSubject.value;
    const updated = [...currentMeasurements, newMeasurement];
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  updateMeasurement(id: number, changes: Partial<Measurement>): void {
    const currentMeasurements = this.measurementsSubject.value;
    const updated = currentMeasurements.map(m =>
      m.id === id ? {...m, ...changes} : m
    );
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  deleteMeasurement(id: number): void {
    const currentMeasurements = this.measurementsSubject.value;
    const updated = currentMeasurements.filter(m => m.id !== id);
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  deleteSelectedMeasurements(): void {
    const currentMeasurements = this.measurementsSubject.value;
    const updated = currentMeasurements.filter(m => !m.selected);
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  toggleSelectAll(selected: boolean): void {
    const currentMeasurements = this.measurementsSubject.value;
    const updated = currentMeasurements.map(m => ({...m, selected}));
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  toggleVerifySelected(verified: boolean): void {
    const currentMeasurements = this.measurementsSubject.value;
    const updated = currentMeasurements.map(m => {
      if (m.selected) {
        return {...m, verified};
      }
      return m;
    });
    this.measurementsSubject.next(updated);
    this.saveToLocalStorage('measurements', updated);
  }

  // Substations
  getSubstations(): Observable<Substation[]> {
    return this.substationsSubject.asObservable();
  }

  getSelectedSubstation(): Observable<Substation> {
    return this.selectedSubstationSubject.asObservable();
  }

  setSelectedSubstation(substation: Substation): void {
    this.selectedSubstationSubject.next(substation);
    this.saveToLocalStorage('selectedSubstation', substation);
  }

  // Tabs and view modes
  getActiveTab(): Observable<string> {
    return this.activeTabSubject.asObservable();
  }

  setActiveTab(tab: string): void {
    this.activeTabSubject.next(tab);
    this.saveToLocalStorage('activeTab', tab);
  }

  getViewMode(): Observable<string> {
    return this.viewModeSubject.asObservable();
  }

  setViewMode(mode: string): void {
    this.viewModeSubject.next(mode);
    this.saveToLocalStorage('viewMode', mode);
  }

  // Private helpers
  private generateId(): number {
    const currentMeasurements = this.measurementsSubject.value;
    const ids = currentMeasurements.map(m => m.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  private loadFromLocalStorage(): void {
    // Load measurements
    const savedMeasurements = localStorage.getItem('measurements');
    if (savedMeasurements) {
      try {
        const parsed = JSON.parse(savedMeasurements);
        this.measurementsSubject.next(parsed);
      } catch (e) {
        console.error('Error parsing measurements from localStorage:', e);
        this.measurementsSubject.next(this.initialMeasurements);
      }
    } else {
      this.measurementsSubject.next(this.initialMeasurements);
    }

    // Load selected substation
    const savedSubstation = localStorage.getItem('selectedSubstation');
    if (savedSubstation) {
      try {
        const parsed = JSON.parse(savedSubstation);
        this.selectedSubstationSubject.next(parsed);
      } catch (e) {
        console.error('Error parsing selected substation from localStorage:', e);
      }
    }

    // Load active tab
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      this.activeTabSubject.next(savedTab);
    }

    // Load view mode
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      this.viewModeSubject.next(savedViewMode);
    }
  }
}
