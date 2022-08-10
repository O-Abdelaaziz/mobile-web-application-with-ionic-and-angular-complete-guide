import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(
    private _navController: NavController,
    private _modalController: ModalController,
    private _router: Router,
  ) {
  }

  ngOnInit() {
  }

  onBookPlace() {
    this._modalController.create({
      component: CreateBookingComponent
    }).then(modelElement => {
      modelElement.present();
    });
    //this._router.navigate(['/places/tabs/discover']);
    //this._navController.navigateBack('/places/tabs/discover');
  }
}
