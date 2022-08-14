import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Place} from "../../place.model";
import {PlacesService} from "../../places.service";
import {Subscription} from "rxjs";
import {BookingService} from "../../../bookings/booking.service";
import {AuthenticationService} from "../../../auth/authentication.service";

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  public place: Place | null = null;
  public isBookable = false;
  private subscription: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private _placeService: PlacesService,
    private _bookingService: BookingService,
    private _navController: NavController,
    private _modalController: ModalController,
    private _loadingController: LoadingController,
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
        const placeId = params.get('placeId');
        this.subscription = this._placeService.getPlace(placeId).subscribe(
          (response: Place) => {
            this.place = response;
            this.isBookable = this.place.userId !== this._authenticationService.userId;
          }
        );
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
      this._loadingController.create({
        message: 'Booking place ...'
      }).then((loadedElement) => {
        loadedElement.present();
        console.log('Booking Confirmed');
        const bookingData = data.bookingData;
        this._bookingService.addBooking(
          this.place.id,
          this.place.title,
          this.place.imageUrl,
          bookingData.firstName,
          bookingData.lastName,
          bookingData.guestNumber,
          bookingData.startDate,
          bookingData.endDate
        ).subscribe(() => {
          loadedElement.dismiss();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
