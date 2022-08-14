import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient,
    private _modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  onPickLocation() {
    this._modalController.create({
      component: MapModalComponent
    }).then((modalElement) => {
      modalElement.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
          address => {
            console.log(address);
          }
        );
      });
      modalElement.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this._httpClient
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=Your_Api_Key`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }
}
