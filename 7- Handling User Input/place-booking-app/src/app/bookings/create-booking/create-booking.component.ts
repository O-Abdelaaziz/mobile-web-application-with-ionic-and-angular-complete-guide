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
  public selectedPalace: Place | null = null;
  @Input()
  public selectedMode: 'select' | 'random';

  public startDate: string;
  public endDate: string;


  constructor(private _modalController: ModalController) {
  }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPalace.availableFrom);
    const availableTo = new Date(this.selectedPalace.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() *
        (availableTo.getTime() -
          7 * 24 * 60 * 60 * 1000 -
          availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
        Math.random() *
        (new Date(this.startDate).getTime() +
          6 * 24 * 60 * 60 * 1000 -
          new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onBookPlace() {
    return this._modalController.dismiss('this is a dummy message', 'confirm');
  }

  onClose() {
    return this._modalController.dismiss(null, 'cancel');
  }
}
