import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../place.model';
import {PlacesService} from '../places.service';
import {IonItemSliding} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  public offers: Place[];
  private subscription: Subscription;

  constructor(private _placesService: PlacesService) {
  }

  ngOnInit() {
    this.subscription = this._placesService.placesList.subscribe((response) => {
      this.offers = response;
    });
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    //slidingItem.close();
    //this._router.navigate(['/','places','tabs','offers','edit-offer',id]);
    console.log('Edit Item swiped!!!', id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
