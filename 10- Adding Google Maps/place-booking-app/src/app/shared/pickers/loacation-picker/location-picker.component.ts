import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {PlaceLocation} from '../../../places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

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
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
          .pipe(
            switchMap(address => {
              pickedLocation.address = address;
              return of(
                this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
              );
            })
          )
          .subscribe(staticMapImageUrl => {
            pickedLocation.staticMapImageUrl = staticMapImageUrl;
            this.selectedLocationImage = staticMapImageUrl;
            this.isLoading = false;
            this.locationPick.emit(pickedLocation);
          });
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

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=Your_Api_Key`;
  }
}
