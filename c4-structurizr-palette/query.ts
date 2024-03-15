{
  getWorkspace(id: "0x2c060"){
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
          middleLabel
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
