import { Component, OnInit, NgZone } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

interface Box {
  id: number;
  text: string;
  position: { x: number; y: number };
  editing?: boolean;
  size?: string;
  font?: string;
  color?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  boxes: {
    id: number;
    text: string;
    position: { x: number; y: number };
    editing?: boolean;
    size?: string;
    font?: string;
    color?: string;
  }[] = [];

  ngOnInit(): void {
    const storedBoxes = localStorage.getItem('boxes');
    if (storedBoxes) {
      this.boxes = JSON.parse(storedBoxes);
    }
  }

  onDragEnd(event: CdkDragEnd): void {
    const draggedItem = event.source.data;
    const newPosition = event.source.getFreeDragPosition();

    draggedItem.position = { x: newPosition.x, y: newPosition.y };

    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  addBox(): void {
    const newBox = {
      id: Date.now(),
      text: 'Drag me!',
      position: { x: 0, y: 0 },
    };
    this.boxes.push(newBox);

    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  startEditing(index: number): void {
    this.editingIndex = index;
  }

  //delete
  hoveredTextItem: Box | null = null;
  onMouseOver(textItem: Box): void {
    this.hoveredTextItem = textItem;
  }

  onMouseOut(): void {
    this.hoveredTextItem = null;
  }

  deleteHoveredTextItem(index: number): void {
    if (index !== null && index >= 0 && index < this.boxes.length) {
      this.boxes.splice(index, 1);
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
      this.editingIndex = null; // Assuming you want to exit editing mode
    }
  }

  //edit
  editingIndex: number | null = null;
  stopEditing(): void {
    this.editingIndex = null;
    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  // feature :  làm việc với danh sách động *ngFor.
  trackByFn(index: number, item: Box): number {
    return item.id;
  }

  // set value h1 h2 h3 ...
  constructor(private zone: NgZone) {}
  selectedSize: string = 'h1';

  applySize(): void {
    if (this.editingIndex !== null) {
      this.boxes[this.editingIndex].size = this.selectedSize;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }

  // set font
  selectedFont: string = '';
  applyFont(font: string): void {
    if (this.editingIndex !== null) {
      this.boxes[this.editingIndex].font = font;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }

  // color
  selectedColor: string = '';
  ApplyColor(color: string): void {
    if (this.editingIndex !== null) {
      this.boxes[this.editingIndex].color = color;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }
}
