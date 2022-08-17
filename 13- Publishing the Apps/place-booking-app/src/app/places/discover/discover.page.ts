import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {SegmentChangeEventDetail} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AuthenticationService} from "../../auth/authentication.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  public places: Place[] = [];
  public loadedPlaces: Place[] = [];
  public relevantPlaces: Place[] = [];
  public isLoading = false;
  private subscription: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.onGetPlaces();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this._placesService.fetchPlace().subscribe(() => {
      this.isLoading = false;
    });
  }

  onGetPlaces() {
    this.subscription = this._placesService.placesList.subscribe((response) => {
      this.places = response;
      this.relevantPlaces = this.places;
      this.loadedPlaces = this.relevantPlaces.slice(1);
    });
    console.log(this.places);
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    this._authService.userId.pipe(
      // take only one
      take(1)
    ).subscribe(userId => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.places;
        this.loadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.places.filter(place => place.userId !== userId);
        this.loadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
