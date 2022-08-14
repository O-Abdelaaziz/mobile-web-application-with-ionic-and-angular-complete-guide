import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Place} from "../../place.model";
import {PlacesService} from "../../places.service";
import {Subscription} from "rxjs";
import {BookingService} from "../../../bookings/booking.service";
import {AuthenticationService} from "../../../auth/authentication.service";
import {MapModalComponent} from "../../../shared/map-modal/map-modal.component";

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  public place: Place | null = null;
  public isBookable = false;
  public isLoading = false;
  private subscription: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private _placeService: PlacesService,
    private _bookingService: BookingService,
    private _navController: NavController,
    private _modalController: ModalController,
    private _loadingController: LoadingController,
    private _actionSheetController: ActionSheetController,
    private _alertController: AlertController,
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
        this.isLoading = true;
        const placeId = params.get('placeId');
        this.subscription = this._placeService.getPlace(placeId).subscribe(
          (response: Place) => {
            this.place = response;
            this.isBookable = this.place.userId !== this._authenticationService.userId;
            this.isLoading = false;
          },
          (error)=>{
            this._alertController.create({
              header: 'An Error occurred!',
              message: 'Place could not be fetched. please tray again later.',
              buttons: [{
                text: 'okay', handler: () => {
                  this._router.navigateByUrl('/places/tabs/discover');
                }
              }]
            }).then((alertElement) => {
              alertElement.present();
            });
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

  onShowFullMap() {
    this._modalController
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address
        }
      })
      .then(modalEl => {
        modalEl.present();
      });
  }
}
