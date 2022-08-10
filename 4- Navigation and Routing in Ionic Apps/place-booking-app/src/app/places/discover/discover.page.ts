import {Component, OnInit} from '@angular/core';
import {PlacesService} from "../places.service";
import {Place} from "../place.model";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  public places: Place[] = [];

  constructor(private _placesService: PlacesService) {
  }

  ngOnInit() {
    this.onGetPlaces();
  }

  onGetPlaces() {
    this.places = this._placesService.placesList;
    console.log(this.places);
  }
}
