import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {PlaceLocation} from '../../location.model';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, {type: contentType});
}

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
      location: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null),
    });
  }

  onCreateOffer() {
    if (this.offerForm.invalid || !this.offerForm.get('image').value) {
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

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');

      } catch (error) {
        console.log(error);
      }
    } else {
      imageFile = imageData;
    }
    this.offerForm.patchValue({image: imageFile});
  }
}
