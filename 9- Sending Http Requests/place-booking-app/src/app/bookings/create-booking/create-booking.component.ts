import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';
import {NgForm} from "@angular/forms";

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

  @ViewChild('bookingForm', {static: true})
  public bookingForm: NgForm;

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
    if (!this.bookingForm.valid || !this.datesValid) {
      return;
    }

    return this._modalController.dismiss(
      {
        bookingData: {
          firstName: this.bookingForm.value.firstName,
          lastName: this.bookingForm.value.lastName,
          guestNumber: this.bookingForm.value.guestNumber,
          startDate: new Date(this.bookingForm.value.dateFrom),
          endDate: new Date(this.bookingForm.value.dateTo),
        }
      },
      'confirm');
  }

  onClose() {
    return this._modalController.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.bookingForm.value['dateFrom']);
    const endDate = new Date(this.bookingForm.value['dateTo']);
    return endDate > startDate;
  }
}
