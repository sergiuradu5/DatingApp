import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeolocationCoords } from '../_models/geolocation-coords';
import {environment} from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  coordsSubject: Subject<GeolocationCoords> = new Subject<GeolocationCoords>();
  currentCoordsObservable = this.coordsSubject.asObservable();
  coords: GeolocationCoords;

  isSupported: boolean = false;
  
  baseUrl= environment.baseUrl;
  constructor(private http: HttpClient) { 
    if (navigator.geolocation) {
      this.isSupported = true;      
      
    }
  }

  getCoordinates() {
    return this.coords;
  };

  initiateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        
        const coords: GeolocationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.coordsSubject.next(coords);
        this.coords = coords;
      },
      () => {alert('Please enable your GPS position feature.');},
      {maximumAge:10000, timeout:5000, enableHighAccuracy: true}
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  updateUserGeolocation(userId: number) {
          const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', '*');
        var coords : GeolocationCoords = this.coords;
        coords.userId = userId;
        return this.http.post(this.baseUrl + 'geolocation/' + userId, coords);
  }
}
