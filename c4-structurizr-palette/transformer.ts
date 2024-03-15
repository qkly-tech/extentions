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

// Obtain the relationship information as they relate 
function generateRelationshipSection(entity, entities, processedEntities, depth) {
    let relationshipSection = '';

    // Get behavior pattern or default
    const behaviorPattern = behaviorPatterns[entity.constructor.id] || 'default'; // Get behavior pattern or default

    // Convert entity name to camelCase
    const camelCaseName = toCamelCase(entity.name);

    // Add indentation based on depth
    const indentation = '\t'.repeat(depth);

    // Keep track of processed links to prevent duplicates
    const processedLinks = new Set();

    // If the entity has relationships, recursively generate the relationship model section for the relationships
    if (entity.linksOut && entity.linksOut.length > 0) {
        entity.linksOut.forEach(link => {
            // Convert link name to camelCase
            const camelCaseLinkName = toCamelCase(link.target.name);
            if (!processedLinks.has(camelCaseLinkName)) {
                // Check if either the source or the target is a group
                const sourceIsGroup = behaviorPattern === 'group';
                const targetEntity = entities.find(e => e.id === link.target.id);
                const targetIsGroup = targetEntity && (behaviorPatterns[targetEntity.constructor.id] === 'group');

                if (sourceIsGroup || targetIsGroup) {
                    // If either the source or the target is a group, skip processing the link
                    relationshipSection += `# ERROR: ${indentation}${camelCaseName} -> ${camelCaseLinkName}: Not allowed to link to or from groups\n`;
                } else {
                    // Process the link only if middleLabel is not null
                    if (link.middleLabel !== null && link.middleLabel !== undefined) {
                        relationshipSection += `${indentation}${camelCaseName} -> ${camelCaseLinkName} "${link.middleLabel}"\n`;
                    } else {
                        relationshipSection += `${indentation}${camelCaseName} -> ${camelCaseLinkName}\n`;
                    }
                }
                processedLinks.add(camelCaseLinkName);
            }
        });
    }

    // Mark entity as processed
    processedEntities.add(entity.id);

    return relationshipSection;
}

  // Obtain the relationship information as they relate 
  function generateViewsSection() {
     let viewSection = '';

      viewSection += `views {
        
        styles {
            element "Software System" {
                background #ffffff
                shape RoundedBox
            }

            element "Person" {
                background #ffffff
                shape Person
            }
        }
        
        theme https://static.structurizr.com/themes/microsoft-azure-2021.01.26/theme.json
    }
    `
    return viewSection
  }  


  // Generate the workspace file
  function generateWorkspaceFile(data) {
    const entities = data.data.getWorkspace.entities;
    const processedEntities = new Set(); // Keep track of processed entities
  
    let modelSection = '';
    let relationshipSection = '';
    let viewSection = '';
  
    // Generate model section recursively for each root entity
    entities.forEach(entity => {
      //  if (!entity.linksOut || entity.linksOut.length === 0) {
            modelSection += generateModelSection(entity, entities, processedEntities, 1);   
      //  }
        relationshipSection += generateRelationshipSection(entity, entities, processedEntities, 1);
    });

     viewSection += generateViewsSection();
  
    return `workspace "${data.data.getWorkspace.name}" "${data.data.getWorkspace.description}" {
    model {
        properties {
            "structurizr.groupSeparator" "/"
        }
        
   ${modelSection}
   
   ${relationshipSection}
   
   }
   
   ${viewSection}
    
  }`;
  }
  
  // Call the function with your data
  const workspaceFile = generateWorkspaceFile(data);
  return workspaceFile;
