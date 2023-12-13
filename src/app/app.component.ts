import { Component, OnInit, NgZone } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

// the structure of Box
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

  // boxes of Box
  // boxes: {
  //   id: number;
  //   text: string;
  //   position: { x: number; y: number };
  //   editing?: boolean;
  //   size?: string;
  //   font?: string;
  //   color?: string;
  // }[] = [];
  boxes: Box[] = [];

  ngOnInit(): void {
    const storedBoxes = localStorage.getItem('boxes');
    if (storedBoxes) {
      this.boxes = JSON.parse(storedBoxes);
    }
  }

  // get index
  onDragEnd(event: CdkDragEnd): void {
    console.log(event);
    const draggedItem = event.source.data;
    const newPosition = event.source.getFreeDragPosition();

    draggedItem.position = { x: newPosition.x, y: newPosition.y };

    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  // add box

  addBox(): void {
    const newBox: Box = {
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

  //hover mouse
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
      this.editingIndex = null;
    }
  }

  //edit
  editingIndex: number | null = null;
  stopEditing(): void {
    this.editingIndex = null;
    localStorage.setItem('boxes', JSON.stringify(this.boxes));
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
