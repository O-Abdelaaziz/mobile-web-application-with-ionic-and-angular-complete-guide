import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output()
  public imagePick = new EventEmitter<string>();
  public selectedImage: string;

  constructor(private _platform: Platform) {
  }

  ngOnInit() {
    console.log('mobile ',this._platform.is('mobile'));
    console.log('hybrid ',this._platform.is('hybrid'));
    console.log('ios ',this._platform.is('ios'));
    console.log('android ',this._platform.is('android'));
    console.log('desktop ',this._platform.is('desktop'));
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    console.log('emm');
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = image.base64String;
        this.imagePick.emit(image.base64String);
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }
}
