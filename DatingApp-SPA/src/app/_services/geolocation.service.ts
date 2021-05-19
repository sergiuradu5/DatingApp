import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeolocationCoords } from '../_models/geolocation-coords';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  coords: any = {};
  isSupported: boolean = false;
  
  baseUrl= environment.baseUrl;
  constructor(private http: HttpClient) { 
    if (navigator.geolocation) {
      this.isSupported = true;
      this.findMe();
    }
  }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Current Geo Position: ', position);
        this.coords.latitude = position.coords.latitude;
        this.coords.longitude = position.coords.longitude;
      });
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
