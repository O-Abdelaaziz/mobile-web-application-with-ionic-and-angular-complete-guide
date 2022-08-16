import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Coordinates, PlaceLocation} from '../../../places/location.model';
import {Capacitor} from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

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
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,
    private _alertController: AlertController,
  ) {
  }

  ngOnInit() {
  }

  onPickLocation() {
    this._actionSheetController.create({
      header: 'Please Choose',
      buttons: [
        {
          text: 'Auto-Locate', handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Pick on map', handler: () => {
            this.openMap();
          }
        },
        {text: 'Cancel', role: 'cancel'},
      ]
    }).then((actionSheetElement) => {
      actionSheetElement.present();
    });

  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude};
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      }).catch((err) => {
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this._alertController.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick     a location!',
      buttons: [{text: 'okay', role: 'cancel'}]
    }).then((alertElement) => {
      alertElement.present();
    });
  }

  private openMap() {
    this._modalController.create({
      component: MapModalComponent
    }).then((modalElement) => {
      modalElement.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalElement.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null
    };

    this.isLoading = true;
    this.getAddress(lat, lng)
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
