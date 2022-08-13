import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Place} from "../../place.model";
import {PlacesService} from "../../places.service";

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  public place: Place | null = null;

  constructor(
    private _placeService: PlacesService,
    private _navController: NavController,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(
      (params) => {
        if (!params.has('placeId')) {
          this._router.navigate(['/places/tabs/discover']);
          return;
        }
        const placeId = params.get('placeId')
        this.place = this._placeService.getPlace(placeId);
      }
    );
  }

  async onBookPlace() {

    this._actionSheetController.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModel('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModel('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetElement => {
      actionSheetElement.present();
    });


    // this._modalController.create({
    //   component: CreateBookingComponent,
    //   componentProps: {selectedPalace: this.place}
    // }).then(modelElement => {
    //   modelElement.present();
    //   modelElement.onDidDismiss();
    // }).then((resultData)=>{
    //   console.log(resultData.data,resultData.role)
    // });
    //this._router.navigate(['/places/tabs/discover']);
    //this._navController.navigateBack('/places/tabs/discover');
  }

  public async openBookingModel(mode: 'select' | 'random') {
    const model = await this._modalController.create({
      component: CreateBookingComponent,
      componentProps: {selectedPalace: this.place, selectedMode: mode}
    });
    await model.present();

    const {data, role} = await model.onWillDismiss();
    console.log('Data: ', data, 'Role: ', role);
    if (role === 'confirm') {
      console.log('Booking Confirmed');
    }
  }
}
