import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map', {static: true})
  mapElementRef: ElementRef;

  constructor(
    private _render: Renderer2,
    private _modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  onCancel() {
    this._modalController.dismiss();
  }

  ngAfterViewInit(): void {
    this.getGoogleMaps().then(
      (googleMaps) => {
        const mapElement = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapElement, {
          center: {lat: -34.397, lng: 150.64},
          zoom: 16
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this._render.addClass(mapElement, 'visible');
        });
      }).catch(error => {
      console.log(error);
    });
  }

  getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=Your_Api_Key&callback=initMap';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK Not Available.');
        }
      };
    });
  }
}
