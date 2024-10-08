import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop'

import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { PokemonListSkeletonComponent } from "./ui/pokemon-list-skeleton.component";



@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [PokemonListComponent, PokemonListSkeletonComponent, RouterLink],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent{

  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);
  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.route.params.pipe(
      map( (params) => params['page'] ?? '1' ),
      map( (page) => ( isNaN(+page) ? 1 : +page ) ),
      map( (page) => Math.max(1, page) )
    )
  );

  public loadOnPageChanged = effect( () => {
    this.loadPokemons(this.currentPage());
  }, {
    allowSignalWrites: true,
  });

  public loadPokemons( page = 0) {
    this.pokemonsService
    .loadPage(page)
    .pipe(tap( () => this.title.setTitle(`Pokemnos SSR - Page ${ page }` )))
    .subscribe( (pokemons) => {
      this.pokemons.set(pokemons);
    });
  }
 }
