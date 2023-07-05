import { Component, Input, OnInit } from '@angular/core';
import { LeafletService } from "./service/leaflet.service";

export const DEFAULT_LAT = 48.20807;
export const DEFAULT_LON = 16.37320;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'projet';

  private map: any;
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;

  constructor(private mapService: LeafletService) {
  }

  ngOnInit(): void {
    if (this.mapService.L) {
      this.initMap();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.setGeoLocation()
        });
      } else {
        alert("User not allowed")
      }
    }
  }

  private initMap(): void {

    this.map = this.mapService.L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 14
    });

    const tiles = this.mapService.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://1938.com.es">Web Inteligencia Artificial</a>'
    });

    this.mapService.L.Routing.control({
      router: this.mapService.L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      fitSelectedRoutes: false,
      show: false,
      routeWhileDragging: true,
      waypoints: [

      ]
    }).addTo(this.map);

    tiles.addTo(this.map);

  }

  setGeoLocation() {
    this.map.setView([this.lat, this.lon], 14);
    this.mapService.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
    }).addTo(this.map);
    const marker = this.mapService.L.marker([this.lat, this.lon]);
    marker.addTo(this.map);
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        alert(position.coords.latitude + ' ' + position.coords.longitude);
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.setGeoLocation()
      });
    }
  }
}