import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../place.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input()
  public offer: Place | null = null;

  constructor() {
  }

  ngOnInit() {
  }

  getDummyDate() {
    return new Date();
  }
}
