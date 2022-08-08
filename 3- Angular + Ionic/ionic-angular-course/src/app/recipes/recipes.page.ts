import {Component, OnInit} from '@angular/core';
import {IRecipe} from './recipe.model';
import {RecipesService} from "./recipes.service";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  public recipes: IRecipe[] = [];

  constructor(private _recipesService: RecipesService) {
  }

  ngOnInit() {
    this.recipes = this._recipesService.getAllRecipes();
  }

}
