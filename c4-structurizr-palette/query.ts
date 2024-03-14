{
    getWorkspace(id: "${workspaceId}"){
      id
      name
      description
      entities {
        id
        children {
          id
          display {
            mode
          }
        }
        ...on Construct {
          id
          name
          data
          description
          linksOut{
            id
            target{
              id,
             name
              }
          }
          constructor{
            id
          }
        }
      }
    }
  }