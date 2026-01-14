// lib/parser.js
let idCounter = 0;
const generateId = () => `el_${Date.now()}_${idCounter++}`;

export function parseConfig(jsonString) {
  // Remove comments (lines starting with --)
  jsonString = jsonString
    .split('\n')
    .filter(line => !line. trim().startsWith('--'))
    .join('\n');
  
  const data = JSON.parse(jsonString);
  
  const fonts = [];
  const variables = [];
  const elements = [];
  let currentPage = 1;
  
  // Convert object entries to array to maintain order
  const entries = Object.entries(data);
  
  entries.forEach(([key, value]) => {
    const val = value;
    
    // Handle page break FIRST before processing other elements
    if (key === 'command' && val === 'pagebreak') {
      currentPage++;
      console.log(`Page break detected, moving to page ${currentPage}`);
      return; // Skip to next iteration
    }
    
    // Parse Fonts
    if (key === 'Font') {
      const parts = val.split('#');
      fonts.push({
        name: parts[0],
        family: parts[1],
        style: parts[2],
        color: parts[3],
        size: parseInt(parts[4]),
      });
    }
    
    // Parse Variables
    else if (key === 'Variable') {
      const parts = val. split('#');
      variables.push({
        name: parts[0],
        fetch: parts[1],
      });
    }
    
    // Parse Text
    else if (key === 'Text') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Text',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        page: currentPage,
        properties:  {
          content: parts[3],
        },
        raw:  val,
      });
    }
    
    // Parse Rectangle
    else if (key === 'rectangle') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Rectangle',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          borderColor: parts[4] || 'gray',
          fillColor: parts[5] || 'transparent',
        },
        raw:  val,
      });
    }
    
    // Parse Box
    else if (key === 'Box') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Box',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          color: parts[4],
          columns: parts. slice(5),
        },
        raw: val,
      });
    }
    
    // Parse Line
    else if (key === 'line') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Line',
        x:  parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          color:  parts[4] || 'black',
        },
        raw:  val,
      });
    }
    
    // Parse Image
    else if (key === 'Image') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Image',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          src: parts[4],
        },
        raw: val,
      });
    }
    
    // Parse Header
    else if (key === 'Header') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Header',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        page: currentPage,
        properties: {
          content: parts[3],
        },
        raw: val,
      });
    }
    
    // Parse TabImage
    else if (key === 'TabImage') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'TabImage',
        x:  parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          src:  parts[4],
        },
        raw: val,
      });
    }
    
    // Parse Map
    else if (key === 'Map') {
      const parts = val.split('#');
      elements.push({
        id: generateId(),
        type: 'Map',
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3]),
        page: currentPage,
        properties: {
          params: parts.slice(4),
        },
        raw: val,
      });
    }
  });
  
  // Log page distribution
  const pageDistribution = {};
  elements.forEach(el => {
    pageDistribution[el.page] = (pageDistribution[el.page] || 0) + 1;
  });
  console.log('Elements per page:', pageDistribution);
  console.log('Total pages:', currentPage);
  
  return {
    profile: data. Profile || '',
    comment: data.Comment || '',
    keyName: data.KeyName || '',
    mainFont: data.MainFont || '',
    totalPages: currentPage,
    fonts,
    variables,
    elements,
  };
}

export function serializeConfig(config) {
  // TODO: Convert back to original JSON format
  return JSON.stringify(config, null, 2);
}