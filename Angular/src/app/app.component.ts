/* eslint-disable @typescript-eslint/no-non-null-assertion, no-else-return, no-console, no-void */
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ColorService, Color } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ColorService],
})
export class AppComponent {
  loadPanelVisible = false;

  total = 100;

  colors: Map<string, Color> = new Map();

  hexCodes: string[] = [];

  visibleCards: Color[] = [];

  pageIndex = 3;

  pageSize = 5;

  constructor(private readonly colorService: ColorService) {}

  ngOnInit(): void {
    this.generateHexCodes();
    this.updateVisibleCards();
  }

  generateHexCodes(): void {
    for (let i = 0; i < this.total; i++) {
      this.hexCodes.push(this.colorService.getRandomPastelColor());
    }
  }

  async fetchColorsForPage(): Promise<void> {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = this.pageIndex * this.pageSize;
    const hexSubset = this.hexCodes.slice(startIndex, endIndex);

    const promises: Promise<Color>[] = hexSubset.map((hex) => {
      if (this.colors.has(hex)) {
        return Promise.resolve(this.colors.get(hex)!);
      } else {
        return firstValueFrom(this.colorService.fetchColorData(hex)).then((data) => {
          const colorData: Color = data;
          this.colors.set(hex, colorData);
          return colorData;
        });
      }
    });

    this.loadPanelVisible = true;
    try {
      const fetchedColors = await Promise.all(promises);
      this.visibleCards = fetchedColors;
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      this.loadPanelVisible = false;
    }
  }

  onPageIndexChange(val: number): void {
    this.pageIndex = val;
    void this.fetchColorsForPage();
  }

  onPageSizeChange(val: number): void {
    this.pageSize = val;
    void this.fetchColorsForPage();
  }

  updateVisibleCards(): void {
    void this.fetchColorsForPage();
  }
}
