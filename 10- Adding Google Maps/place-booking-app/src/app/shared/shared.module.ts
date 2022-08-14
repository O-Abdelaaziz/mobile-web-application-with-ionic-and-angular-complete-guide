import {NgModule} from '@angular/core';
import {LoactionPickerComponent} from './pickers/loaction-picker/loaction-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [LoactionPickerComponent, MapModalComponent],
  imports: [CommonModule],
  exports: [LoactionPickerComponent, MapModalComponent],
})
export class SharedModule {
}
