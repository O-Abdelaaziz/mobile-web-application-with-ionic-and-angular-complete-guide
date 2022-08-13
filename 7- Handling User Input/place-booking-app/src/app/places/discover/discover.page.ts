import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {SegmentChangeEventDetail} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  public places: Place[] = [];
  public loadedPlaces: Place[] = [];
  private subscription: Subscription;

  constructor(private _placesService: PlacesService) {
  }

  ngOnInit() {
    this.onGetPlaces();
  }

  onGetPlaces() {
    this.subscription = this._placesService.placesList.subscribe((response) => {
      this.places = response;
      this.loadedPlaces = response.slice(1);
    });
    console.log(this.places);
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
