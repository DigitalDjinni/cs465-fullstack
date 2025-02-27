import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private tripUrl = this.apiBaseUrl + '/trips';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  public getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.tripUrl}/${tripCode}`);
  }

  public addTrip(formData: Trip): Observable<Trip> {
    const token = this.storage.getItem('travlr-token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post<Trip>(this.tripUrl, formData, { headers });
  }

  public updateTrip(formData: Trip): Observable<Trip> {
    const token = this.storage.getItem('travlr-token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put<Trip>(`${this.tripUrl}/${formData.code}`, formData, { headers });
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
