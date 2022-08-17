import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Place} from "../../place.model";
import {PlacesService} from "../../places.service";
import {ActivatedRoute} from "@angular/router";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  public place: Place;
  public offerForm: FormGroup;

  constructor(
    private _placesService: PlacesService,
    private _activatedRoute: ActivatedRoute,
    private _navController: NavController) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this._navController.navigateBack('/places/tabs/offers');
      }
      this.place = this._placesService.getPlace(params.get('placeId'));

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

    });
  }

  onUpdateOffer() {
    console.log(this.offerForm.value);
    if (this.offerForm.invalid) {
      return;
    }
    console.log(this.offerForm);
  }
}
