import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private readonly apiEndpoint = 'https://www.thecolorapi.com/id?hex=';

  constructor(private readonly http: HttpClient) { }

  private hsvToHex(h: number, s: number, v: number): string {
    let r = 0;
    let g = 0;
    let b = 0;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: [r, g, b] = [v, t, p]; break;
      case 1: [r, g, b] = [q, v, p]; break;
      case 2: [r, g, b] = [p, v, t]; break;
      case 3: [r, g, b] = [p, q, v]; break;
      case 4: [r, g, b] = [t, p, v]; break;
      case 5: [r, g, b] = [v, p, q]; break;
    }

    const toHex = (x: number): string => Math.round(x * 255).toString(16).padStart(2, '0');
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  getRandomPastelColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.random() * 0.4 + 0.2;
    const brightness = Math.random() * 0.3 + 0.7;
    return this.hsvToHex(hue, saturation, brightness);
  }

  fetchColorData(hex: string): Observable<Color> {
    return this.http.get<Color>(`${this.apiEndpoint}${hex}`).pipe(
      catchError((error) => {
        console.error(`Error fetching color for hex ${hex}:`, error);
        return throwError(() => error);
      }),
    );
  }
}

export interface Color {
  image: string;
  name: string;
}
