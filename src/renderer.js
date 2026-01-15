
// Color name to hex mapping
const colorMap = {
  'gray':  '#808080',
  'grey': '#808080',
  'black': '#000000',
  'white': '#ffffff',
  'red': '#ff0000',
  'blue': '#0000ff',
  'green': '#008000',
  'yellow':  '#ffff00',
  'pink': '#ffc0cb',
  'transparent': 'transparent',
};

const getColor = (color) => colorMap[color?.toLowerCase()] || color || '#000000';

export function renderElement(element, fabric, scale = 1) {
  switch (element.type) {
    case 'Text': {
      const content = element.properties.content || '';
      const font = element.properties.font || 'plain12';
      
      let text = content;
      let fontStyle = 'normal';
      let fontSize = 12;
      
      if (font.includes('bold')) {
        fontStyle = 'bold';
      }

      const sizeMatch = font.match(/\d+/);
      if (sizeMatch) {
        fontSize = parseInt(sizeMatch[0]);
      }
      
      return new fabric.Text(text, {
        left: element.x * scale,
        top: element.y * scale,
        fontSize: fontSize * scale,
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
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        fill: fillColor === 'transparent' ?  'transparent' : fillColor,
        stroke: borderColor,
        strokeWidth: 1 * scale,
        selectable:  true,
        hasControls:  true,
      });
    }

    case 'Line': {
      const color = getColor(element.properties.color);
      
      return new fabric.Line([
        element.x * scale, 
        element.y * scale, 
        (element.x + element.width) * scale,
        (element.y + element.height) * scale 
      ], {
        stroke: color,
        strokeWidth: 2 * scale,
        selectable: true,
        hasControls: true,
      });
    }
    
    case 'Box':  {
      const color = getColor(element.properties.color);
      const objects = [];

      // Add rectangle
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: element.width * scale,
        height: element.height * scale,
        fill: color,
        stroke: '#000000',
        strokeWidth:  1 * scale,
      });
      objects.push(rect);

      // Add column texts
      const columns = element.properties. columns || [];
      columns.forEach((col, idx) => {
        if (idx % 2 === 0 && columns[idx + 1]) {
          const xPos = parseFloat(col);
          const content = columns[idx + 1];
          
          const text = new fabric.Text(content, {
            left: (xPos - element.x) * scale + (element.width ),
            top: 2 * scale + (element.width),
            fontSize:  10 * scale,
            fontFamily: 'Calibri, sans-serif',
            fill: '#000000',
          });
          objects.push(text);
        }
      });

      // Create group with all objects
      const group = new fabric.Group(objects, {
        left: element.x * scale,
        top: element.y * scale,
        selectable: true,
        hasControls: true,
      });
      
      return group;
    }

    case 'Image': {
      return new fabric.Rect({
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element. height * scale,
        fill:  '#cccccc',
        stroke: '#666666',
        strokeWidth: 2 * scale,
        selectable: true,
        hasControls: true,
      });
    }

    default: 
      return null;
  }
}

export function renderElements(elements, page, fabricCanvas, fabric, scale = 1) {
  // Clear canvas
  fabricCanvas.clear();
  fabricCanvas.backgroundColor = 'transparent';

  // Filter elements for current page
  const pageElements = elements.filter(el => el.page === page);

  console.log(`Rendering ${pageElements.length} elements for page ${page} at scale ${scale}`);
  console.log('First element:', pageElements[0]);

  // Render each element
  pageElements.forEach(element => {
    try {
      const fabricObject = renderElement(element, fabric, scale);
      if (fabricObject) {
        fabricObject. set({ data: { elementId:  element.id } });
        fabricCanvas.add(fabricObject);
      }
    } catch (error) {
      console.error(`Error rendering element ${element.id} (${element.type}):`, error);
    }
  });

  fabricCanvas.renderAll();
}