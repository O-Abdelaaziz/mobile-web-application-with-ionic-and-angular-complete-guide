import {Component, OnInit} from '@angular/core';
import {RecipesService} from "../recipes.service";
import {ActivatedRoute} from "@angular/router";
import {IRecipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  public recipe: IRecipe | null = null;

  constructor(
    private _recipesService: RecipesService,
    private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRecipeDetails();
  }

  getRecipeDetails() {
    this._activatedRoute.paramMap.subscribe(parameter => {
      if (!parameter.has('recipeId')) {
        return;
      }
      const recipeId = parameter.get('recipeId');
      this.recipe = this._recipesService.getRecipe(recipeId);
    });
  }
}
