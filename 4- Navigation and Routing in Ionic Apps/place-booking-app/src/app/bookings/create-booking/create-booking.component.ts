import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input()
  public selectedPalace: Place | null = null

  constructor(private _modalController: ModalController) {
  }

  ngOnInit() {
  }

  onBookPlace() {
    return this._modalController.dismiss('this is a dummy message', 'confirm');
  }

  onClose() {
    return this._modalController.dismiss(null, 'cancel');
  }
}
