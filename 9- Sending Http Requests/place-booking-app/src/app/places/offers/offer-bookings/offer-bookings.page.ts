import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  public place: Place | null = null;
  private subscription: Subscription;

  constructor(private _placeService: PlacesService, private _router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getPlaceDetail();
  }

  getPlaceDetail() {
    this._activatedRoute.paramMap.subscribe(parameter => {
      if (!parameter.has('placeId')) {
        this._router.navigate(['/places/tabs/offers']);
        return;
      }
      const placeId = parameter.get('placeId');
      this.subscription = this._placeService.getPlace(placeId).subscribe(
        (response: Place) => {
          this.place = response;
        }
      );
      console.log(this.place);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
