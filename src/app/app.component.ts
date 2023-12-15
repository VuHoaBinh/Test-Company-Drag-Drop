import { Component, OnInit, NgZone } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

// the structure of Box
interface Box {
  id: number;
  text: string;
  position: { x: number; y: number };
  editing?: boolean;
  size?: string;
  font?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  color?: string;
  hover?: boolean;
  increaseSize?: boolean;
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

  editingIndex: number | null = null;
  selectedFont: string = '';
  hoveredTextItem: Box | null = null;

  constructor(private zone: NgZone) {}

  // hover mouse
  onMouseOver(textItem: Box): void {
    this.hoveredTextItem = textItem;
  }

  onMouseOut(): void {
    this.hoveredTextItem = null;
  }

  // get index
  onDragEnd(event: CdkDragEnd, textItem: Box): void {
    const draggedItem = event.source.data;
    const newX = draggedItem.position.x + event.distance.x;
    const newY = draggedItem.position.y + event.distance.y;

    const minX = 0;
    const minY = 0;
    const maxX = 960 - event.source.element.nativeElement.clientWidth;
    const maxY = 690 - event.source.element.nativeElement.clientHeight;

    if (newX >= minX && newX <= maxX && newY >= minY && newY <= maxY) {
      draggedItem.position.x = newX;
      draggedItem.position.y = newY;
    } else {
      draggedItem.position.x = Math.max(minX, Math.min(newX, maxX));
      draggedItem.position.y = Math.max(minY, Math.min(newY, maxY));
    }

    event.distance.x = 0;
    event.distance.y = 0;
    event.dropPoint.x = 0;
    event.dropPoint.y = 0;

    console.log(draggedItem);

    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  ngOnInit(): void {
    const storedBoxes = localStorage.getItem('boxes');
    if (storedBoxes) {
      this.boxes = JSON.parse(storedBoxes);
    }
  }

  // add box
  addBox(): void {
    const newBox: Box = {
      id: Date.now(),
      text: 'Text',
      position: { x: 0, y: 0 },
      size: 'h1',
      hover: false,
      increaseSize: false,
      font: {
        bold: false,
        italic: false,
        underline: false,
      },
    };

    this.boxes.push(newBox);

    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  startEditing(index: number): void {
    this.editingIndex = index;
  }

  //delete
  deleteHoveredTextItem(index: number): void {
    if (index !== null && index >= 0 && index < this.boxes.length) {
      this.boxes.splice(index, 1);
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
      this.editingIndex = null;
    }
  }

  //edit
  stopEditing(): void {
    this.editingIndex = null;
    localStorage.setItem('boxes', JSON.stringify(this.boxes));
  }

  // set value h1 h2 h3 ...
  selectedSize: string = 'h1';
  applySize(): void {
    if (this.editingIndex !== null) {
      this.boxes[this.editingIndex].size = this.selectedSize;
      console.log('haha: ', this.selectedSize);
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }

  // set font
  applyFont(font: string): void {
    if (this.editingIndex !== null && this.boxes[this.editingIndex]?.font) {
      const fontStyles = this.boxes[this.editingIndex].font;

      if (font === 'bold' && fontStyles) {
        fontStyles.bold = !fontStyles.bold;
      }
      if (font === 'italic' && fontStyles) {
        fontStyles.italic = !fontStyles.italic;
      }
      if (font === 'underline' && fontStyles) {
        fontStyles.underline = !fontStyles.underline;
      }

      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }

  // color
  ApplyColor(color: string): void {
    if (this.editingIndex !== null) {
      this.boxes[this.editingIndex].color = color;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
    }
  }

  // hover color
  changeHoverColor(index: number): void {
    console.log('changeHoverColor', index);
    if (index !== null && index >= 0 && index < this.boxes.length) {
      this.boxes[index].hover = !this.boxes[index].hover;
      this.boxes[index].increaseSize = false;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
      this.editingIndex = null;
    }
  }

  // hover increase size
  changeHoverSize(index: number): void {
    console.log('changeHoverColor', index);
    if (index !== null && index >= 0 && index < this.boxes.length) {
      this.boxes[index].increaseSize = !this.boxes[index].increaseSize;
      this.boxes[index].hover = false;
      localStorage.setItem('boxes', JSON.stringify(this.boxes));
      this.editingIndex = null;
    }
  }
}
