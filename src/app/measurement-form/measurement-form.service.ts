import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private measurements = new BehaviorSubject<any[]>([]);

  addMeasurement(measurement: any) {
    const newMeasurements = [...this.measurements.value, measurement];

    this.measurements.next(newMeasurements);
  }

  getMeasurements(): Observable<any[]> {
    return this.measurements.asObservable();
  }
}
