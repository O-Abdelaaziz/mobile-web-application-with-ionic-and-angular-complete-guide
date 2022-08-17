import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public text = 'I would like to learn ionic with angular';

  constructor() {
  }

  public onChangeText() {
    this.text = 'Yes, i will ... is just need a start.';
    setTimeout(() => {
      this.text = 'I would like to learn ionic with angular';
    }, 3000);
  }
}
