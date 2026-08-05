import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from './services/pokemon-service';
import { PokemonCard } from './components/pokemon-card/pokemon-card';

@Component({
  selector: 'app-root',
  imports: [PokemonCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private service = inject(PokemonService);

  // HTTP の結果を signal に変換(届くまでは initialValue の空配列)
  readonly pokemons = toSignal(this.service.getAll(), { initialValue: [] });

  // ─── 状態 ───
  readonly query = signal('');
  readonly favoriteIds = signal<ReadonlySet<number>>(new Set());

  // ─── 状態から導出される表示リスト ───
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.pokemons();
    return this.pokemons().filter(p => p.ja.includes(q) || p.en.includes(q));
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggleFavorite(id: number): void {
    const next = new Set(this.favoriteIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.favoriteIds.set(next);
  }
}
