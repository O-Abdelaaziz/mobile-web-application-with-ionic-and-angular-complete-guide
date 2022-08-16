import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
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
  @ViewChild('filePicker', {static: false})
  public filePicker: ElementRef<HTMLInputElement>;
  public selectedImage: string;
  public usePicker = false;

  constructor(private _platform: Platform) {
  }

  ngOnInit() {
    console.log('mobile ', this._platform.is('mobile'));
    console.log('hybrid ', this._platform.is('hybrid'));
    console.log('ios ', this._platform.is('ios'));
    console.log('android ', this._platform.is('android'));
    console.log('desktop ', this._platform.is('desktop'));
    if (
      (this._platform.is('mobile') && !this._platform.is('hybrid')) ||
      (this._platform.is('desktop'))
    ) {
      this.usePicker = true;
      console.log('use picker is true: ', this.usePicker);
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePicker.nativeElement.click();
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

  onFileChosen(event: Event) {
    console.log(event);
  }
}
