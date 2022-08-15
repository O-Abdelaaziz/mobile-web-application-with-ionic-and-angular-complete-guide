import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Coordinates, PlaceLocation} from '../../../places/location.model';
import {Capacitor, Plugins} from '@capacitor/core';

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
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude};
      }).cache((err) => {
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this._alertController.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick     a location!'
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
