import {Component, OnInit} from '@angular/core';
import {Place} from '../place.model';
import {PlacesService} from '../places.service';
import {IonItemSliding} from "@ionic/angular";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  public offers: Place[];

  constructor(private placesService: PlacesService) {
  }

  ngOnInit() {
    this.offers = this.placesService.placesList;
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    //slidingItem.close();
    //this._router.navigate(['/','places','tabs','offers','edit-offer',id]);
    console.log('Edit Item swiped!!!', id);
  }
}
