import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  public place: Place;
  public placeId: string;
  public offerForm: FormGroup;
  public isLoading = false;
  private subscription: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _navController: NavController,
    private _loadingController: LoadingController,
    private _alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this._navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = params.get('placeId');
      this.isLoading = true;
      this.subscription = this._placesService.getPlace(params.get('placeId')).subscribe(
        (response: Place) => {
          this.place = response;
          this.offerForm = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)],
            })
          });
          this.isLoading = false;
        },
        (error) => {
          this._alertController.create({
            header: 'An Error occurred!',
            message: 'Place could not be fetched. please tray again later.',
            buttons: [{
              text: 'okay', handler: () => {
                this._router.navigateByUrl('/places/tabs/offers');
              }
            }]
          }).then((alertElement) => {
            alertElement.present();
          });
        }
      );
    });
  }

  onUpdateOffer() {
    console.log(this.offerForm.value);
    if (this.offerForm.invalid) {
      return;
    }
    this._loadingController.create({
      message: 'Updating Place ...'
    }).then((loadingElement) => {
      loadingElement.present();
      this._placesService.updatePlace(
        this.place.id,
        this.offerForm.value.title,
        this.offerForm.value.description,
      ).subscribe((response) => {
        loadingElement.dismiss();
        this.offerForm.reset();
        this._router.navigateByUrl('/');
      });
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
