import { Component } from '@angular/core';
import { ColorService } from './app.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ColorService],
})
export class AppComponent {
  loadPanelVisible: boolean = false;
  total: number = 100;
  colors: Array<{ name: string; image: string }> = [];
  visibleCards: Array<{ name: string; image: string }> = [];
  pageIndex: number = 3;
  pageSize: number = 5;
  constructor(private colorService: ColorService) {}

  ngOnInit(): void {
    this.generateColors();
  }

  async generateColors() {
    this.loadPanelVisible = true;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < this.total; i++) {
      const hex = this.colorService.getRandomPastelColor();
      const promise = firstValueFrom(
        this.colorService.fetchColorData(hex)
      ).then((data) => {
        return { name: data.name.value, image: data.image.bare };
      });

      promises.push(promise);
    }

    try {
      this.colors = await Promise.all(promises);
    } catch (error) {
      console.error('Error generating colors:', error);
    }
    finally {
      this.setVisibleCards();
      this.loadPanelVisible = false;
    }
  }

  onPageIndexChange(val: number) {
    this.pageIndex = val;
    this.setVisibleCards();
  }

  onPageSizeChange(val: number) {
    this.pageSize = val;
    this.setVisibleCards();
  }

  setVisibleCards() {
    this.visibleCards = this.colors.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
  }

}
