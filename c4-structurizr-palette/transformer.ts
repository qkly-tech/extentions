// Define behavior patterns based on constructor IDs
const behaviorPatterns = {
    'proto:c4-solution-design:software-system:1': 'softwareSystem', // Example pattern for software systems
    'proto:c4-solution-design:container:1': 'container', // Example pattern for containers
    'proto:c4-solution-design:group:1': 'group', // Example pattern for groups
    'proto:c4-solution-design:person:1': 'person', // Example pattern for a person
    'proto:c4-solution-design:component:1': 'component', // Example pattern for a component
  
    // Add more patterns as needed
  };
  
  // Function to convert a string to camelCase
  function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
  
  // Generate the model section recursively based on behavior patterns
  function generateModelSection(entity, entities, processedEntities, depth) {
    let modelSection = '';
    const behaviorPattern = behaviorPatterns[entity.constructor.id] || 'default'; // Get behavior pattern or default
  
    // Convert entity name to camelCase
    const camelCaseName = toCamelCase(entity.name);
  
    // Add indentation based on depth
    const indentation = '\t'.repeat(depth);
  
    // Check if the entity has already been processed
    if (processedEntities.has(entity.id)) {
        return modelSection; // Skip processing if entity has already been processed
    }
  
    // Add the entity details to the model section based on behavior pattern
    switch (behaviorPattern) {
        case 'softwareSystem':
            // Generate software system model section
            modelSection += `${indentation}${camelCaseName} = softwareSystem "${entity.name}"`;
            break;
        case 'container':
            // Generate container model section
            modelSection += `${indentation}${camelCaseName} = container "${entity.name}"`;
            break;
        case 'person':
            // Generate person model section
            modelSection += `${indentation}${camelCaseName} = person "${entity.name}"`;
            break;
        case 'component':
            // Generate person model section
            modelSection += `${indentation}${camelCaseName} = component "${entity.name}"`;
            break;
        case 'group':
            // Generate group model section
            modelSection += `${indentation}group "${entity.name}"`;
            break;
        default:
            // Use default behavior for other types
            // If the entity has children, recursively generate model section for children
            if (entity.children && entity.children.length > 0) {
                modelSection += `${indentation}${camelCaseName} = container "${entity.name}"`;
            } else {
                // If the entity has no children, add it directly to the model section
                modelSection += `${indentation}${camelCaseName} = container "${entity.name}"`;
            }
            break;
    }
  
    // If the entity has children, recursively generate model section for children
    if (entity.children && entity.children.length > 0) {
        modelSection += ' {\n';
        entity.children.forEach(childId => {
            const childEntity = entities.find(ent => ent.id === childId.id);
            if (childEntity) {
                modelSection += generateModelSection(childEntity, entities, processedEntities, depth + 1);
            }
        });
        modelSection += `${indentation}}\n`;
    } else {
        // If the entity has no children, add a newline character
        modelSection += '\n';
    }
  
    // Mark entity as processed
    processedEntities.add(entity.id);
  
    return modelSection;
  }
  
  
  // Generate the workspace file
  function generateWorkspaceFile(data) {
    const entities = data.data.getWorkspace.entities;
    const processedEntities = new Set(); // Keep track of processed entities
  
    let modelSection = '';
  
    // Generate model section recursively for each root entity
    entities.forEach(entity => {
        if (!entity.linksOut || entity.linksOut.length === 0) {
            modelSection += generateModelSection(entity, entities, processedEntities, 1);
        }
    });
  
    return `workspace "${data.data.getWorkspace.name}" "${data.data.getWorkspace.description}" {
    model {
  ${modelSection}
    }
  }`;
  }
  
  // Call the function with your data
  const workspaceFile = generateWorkspaceFile(data);
  return workspaceFile;
  