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

  // Obtain the Dynamic views for the site-generator
  function generateDynamicViewsSection(entity, entities, processedEntities, depth) {

    let modelSection = '';
    
    let dynamicViewSection = '';
    
    
    const behaviorPattern = behaviorPatterns[entity.constructor.id] || 'default'; // Get behavior pattern or default
  
    // Convert entity name to camelCase
    const camelCaseName = toCamelCase(entity.name);
  
    // Add indentation based on depth
    const indentation = '\t'.repeat(depth);
  
    // Check if the entity has already been processed
    if (processedEntities.has(entity.id)) {
        return dynamicViewSection; // Skip processing if entity has already been processed
    }
  
    // Add the entity details to the model section based on behavior pattern
    switch (behaviorPattern) {
        case 'softwareSystem':
        
            // Generate a Uniquely Named SystemContex diagram for each softwareSystem
            dynamicViewSection += `${indentation} 
                systemContext ${camelCaseName} "${camelCaseName}_SystemContext" {
                    include *
                    autolayout
                    title "C4 - System Context Digram of ${camelCaseName}" 
                }
            `;

            // Generate a container diagram for each softwareSystem
            dynamicViewSection += `${indentation} 
                container ${camelCaseName} {
                    include *
                    autolayout
                    title "C4 - System Context Digram of ${camelCaseName}" 
                }
            `;
            break;
        case 'container':
            // Generate components of a container
            dynamicViewSection += `${indentation} 
                component ${camelCaseName} {
                    include *
                    autolayout
                    title "C4 - System Context Digram of ${camelCaseName}" 
                }
            `;
            break;
        case 'person':
            // Generate person model section
          //  modelSection += `${indentation}${camelCaseName} = person "${entity.name}"`;
            break;
        case 'component':
            // Generate software system model section

            break;
        case 'group':
            // Generate group model section
        //    modelSection += `${indentation}group "${entity.name}"`;
            break;
        default:
            // Use default behavior for other types
            // Generate software system model section
            break;
    }

    // Mark entity as processed
    processedEntities.add(entity.id);

    return dynamicViewSection;
  } 


  // Generate the workspace file
  function generateWorkspaceFile(data) {
    const entities = data.data.getWorkspace.entities;
    const processedEntities = new Set(); // Keep track of processed entities
    const processedRelationshipEntities = new Set(); // Keep track of processed entities
    const processedViewEntities = new Set(); // Keep track of processed entities
  
    let modelSection = '';
    let relationshipSection = '';
    let dynamicViewSection = '';
  
    // Generate model section recursively for each root entity
    entities.forEach(entity => {
        modelSection += generateModelSection(entity, entities, processedEntities, 1);   
        relationshipSection += generateRelationshipSection(entity, entities, processedRelationshipEntities, 1);
        dynamicViewSection += generateDynamicViewsSection(entity, entities, processedViewEntities, 1);
    });
  
    return `workspace "${data.data.getWorkspace.name}" "${data.data.getWorkspace.description}" {
    
    !docs workspace-docs
    !adrs workspace-adrs
    
    model {
        properties {
            "c4plantuml.elementProperties" "true"
            "c4plantuml.tags" "true"
            "generatr.style.colors.primary" "#FF00FF"
            "generatr.style.colors.secondary" "#26BB98"
            "generatr.style.faviconPath" "site/favicon.ico"
            "generatr.style.logoPath" "https://cdn.icon-icons.com/icons2/1965/PNG/512/tool12_122837.png"

            // Absolute URL's like "https://example.com/custom.css" are also supported
            "generatr.style.customStylesheet" "site/custom.css"

            "generatr.svglink.target" "_self"

            // Full list of available "generatr.markdown.flexmark.extensions"
            // "Abbreviation,Admonition,AnchorLink,Aside,Attributes,Autolink,Definition,Emoji,EnumeratedReference,Footnotes,GfmIssues,GfmStrikethroughSubscript,GfmTaskList,GfmUsers,GitLab,Ins,Macros,MediaTags,ResizableImage,Superscript,Tables,TableOfContents,SimulatedTableOfContents,Typographic,WikiLinks,XWikiMacro,YAMLFrontMatter,YouTubeLink"
            // see https://github.com/vsch/flexmark-java/wiki/Extensions
            // ATTENTION:
            // * "generatr.markdown.flexmark.extensions" values must be separated by comma
            // * it's not possible to use "GitLab" and "ResizableImage" extensions together
            // default behaviour, if no generatr.markdown.flexmark.extensions property is specified, is to load the Tables extension only
            "generatr.markdown.flexmark.extensions" "Abbreviation,Admonition,AnchorLink,Attributes,Autolink,Definition,Emoji,Footnotes,GfmTaskList,GitLab,MediaTags,Tables,TableOfContents,Typographic"

            "generatr.site.exporter" "c4"
            "generatr.site.externalTag" "External System"
            "generatr.site.nestGroups" "false"
            "structurizr.groupSeparator" "/"
        }
        
   ${modelSection}
   
   ${relationshipSection}
   
   }
   views {
   
        systemlandscape "SystemLandscape" {
            include *
            autoLayout
        }  
     
     ${dynamicViewSection}
   }
    
  }`;
  }
  
  // Call the function with your data
  const workspaceFile = generateWorkspaceFile(data);
  return workspaceFile;
