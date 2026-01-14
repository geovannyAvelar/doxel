// lib/renderer.js

// Color name to hex mapping
const colorMap = {
  'gray': '#808080',
  'grey': '#808080',
  'black': '#000000',
  'white': '#ffffff',
  'red': '#ff0000',
  'blue': '#0000ff',
  'green': '#008000',
  'yellow': '#ffff00',
  'pink': '#ffc0cb',
  'transparent': 'transparent',
};

const getColor = (color) => colorMap[color?. toLowerCase()] || color || '#000000';

export function renderElement(element, fabric) {
  // fabric is the actual fabric module, not { fabric }
  
  switch (element.type) {
    case 'Text': {
      // Parse font from content:  |bold12|Text content
      const content = element.properties.content || '';
      const fontMatch = content.match(/\|([^|]+)\|(.+)/);
      
      let text = content;
      let fontStyle = 'normal';
      let fontSize = 12;
      
      if (fontMatch) {
        const fontName = fontMatch[1]; // e.g., "bold12"
        text = fontMatch[2];
        
        if (fontName. includes('bold')) {
          fontStyle = 'bold';
        }
        const sizeMatch = fontName.match(/\d+/);
        if (sizeMatch) {
          fontSize = parseInt(sizeMatch[0]);
        }
      }
      
      return new fabric.Text(text, {
        left: element. x,
        top: element. y,
        fontSize: fontSize,
        fontFamily:  'Calibri, sans-serif',
        fontWeight: fontStyle,
        fill: '#000000',
        selectable: true,
        hasControls: true,
      });
    }
    
    case 'Rectangle':  {
      const fillColor = getColor(element.properties.fillColor);
      const borderColor = getColor(element.properties.borderColor);
      
      return new fabric.Rect({
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        fill: fillColor === 'transparent' ?  'transparent' : fillColor,
        stroke: borderColor,
        strokeWidth: 1,
        selectable: true,
        hasControls: true,
      });
    }
    
    case 'Line': {
      const color = getColor(element. properties. color);
      
      return new fabric.Line([
        element. x, 
        element.y, 
        element.x + element.width, 
        element.y + element.height
      ], {
        stroke:  color,
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
      });
    }
    
    case 'Box':  {
      // Box is a complex table-like structure
      const color = getColor(element.properties. color);
      
      const objects = [];
      
      // Add rectangle
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: element. width,
        height: element. height,
        fill: color,
        stroke: '#000000',
        strokeWidth:  1,
      });
      objects.push(rect);
      
      // Add column texts (simplified)
      const columns = element. properties.columns || [];
      columns.forEach((col, idx) => {
        if (idx % 2 === 0 && columns[idx + 1]) {
          const xPos = parseFloat(col);
          const content = columns[idx + 1];
          
          const text = new fabric. Text(content, {
            left:  xPos - element.x,
            top: 2,
            fontSize: 10,
            fontFamily: 'Calibri, sans-serif',
            fill:  '#000000',
          });
          objects.push(text);
        }
      });
      
      // Create group with all objects
      const group = new fabric.Group(objects, {
        left: element.x,
        top: element.y,
        selectable: true,
        hasControls: true,
      });
      
      return group;
    }
    
    case 'Image': {
      // Placeholder for images - would need actual image loading
      return new fabric. Rect({
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        fill: '#cccccc',
        stroke:  '#666666',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
      });
    }
    
    default: 
      return null;
  }
}

export function renderElements(elements, page, fabricCanvas, fabric) {
  // Clear canvas
  fabricCanvas.clear();
  fabricCanvas.backgroundColor = 'transparent';
  
  // Filter elements for current page
  const pageElements = elements.filter(el => el.page === page);
  
  console.log(`Rendering ${pageElements.length} elements for page ${page}`);
  
  // Render each element
  pageElements.forEach(element => {
    try {
      const fabricObject = renderElement(element, fabric);
      if (fabricObject) {
        fabricObject.set({ data: { elementId: element.id } });
        fabricCanvas.add(fabricObject);
      }
    } catch (error) {
      console.error(`Error rendering element ${element.id} (${element.type}):`, error);
    }
  });
  
  fabricCanvas.renderAll();
}