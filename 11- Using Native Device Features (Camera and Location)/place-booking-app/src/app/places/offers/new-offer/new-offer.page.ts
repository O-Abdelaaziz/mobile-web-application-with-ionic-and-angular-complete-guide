import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlacesService} from "../../places.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {PlaceLocation} from "../../location.model";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  public offerForm: FormGroup;

  constructor(
    private _placesService: PlacesService,
    private _loadingController: LoadingController,
    private _router: Router) {
  }

  ngOnInit() {
    this.offerForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onCreateOffer() {
    if (this.offerForm.invalid) {
      return;
    }
    this._loadingController.create({
      message: 'Creating place...',
    }).then((loadingElement) => {
      loadingElement.present();
    });
    this._placesService.addPlace(
      this.offerForm.value.title,
      this.offerForm.value.description,
      this.offerForm.value.price,
      new Date(this.offerForm.value.dateFrom),
      new Date(this.offerForm.value.dateTo),
      this.offerForm.value.location,
    ).subscribe(() => {
      this._loadingController.dismiss();
      this.offerForm.reset();
      this._router.navigateByUrl('/');
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.offerForm.patchValue({location: location});
  }

  onImagePicked(imageData: string) {
    console.log(imageData);
  }
}
