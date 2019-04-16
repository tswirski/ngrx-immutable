# ngrx-immutable

Redux state made easy.

Wile there is lot of other tools in the wild - most of them are either overengineered or do not provide enough flexibility to do the job.  Maintaining Redux state with plain JavaScript might be pain in the...neck - due to nested objects. Therefor lot of people go for the immutable-js along with redux-immutable. While it wokrs perfectly well it also brings thousands lines of code which is not really necessary... especially if you prefere classic approach.

This is how our sample store looks like. 

`var store = {
  users: [
    {
      id: 1,
      name: 'Tom',
      ownedVehicles: [{
          type: 'Car',
          subType: 'SUV',
          make: 'Suzuki',
          model: 'Vitara',
          features: [
            { id: 1, name: 'Radio'},
            { id: 2, name: 'A/c'},
          ],
      }, {
          type: 'Car',
          subType: 'Sedan',
          make: 'Audi',
          model: 'A4 B6',
          features: [
            { id: 1, name: 'Radio'},
            { id: 2, name: 'A/c'},
            { id: 3, name: 'AirBag'},
            { id: 4, name: 'Xenon'},
          ]
      }, {
          type: 'Motorcycle',
          subType: 'Sportbike',
          make: 'Suzuki',
          model: 'GSXR600',
          features: []
      },
    ]
  }]
};`

Let's now do couple of basic Redux store operations. 
For sake of presentation we will:

1. Change Car Model for Audi from "A4 B6" to "R8",
2. Add "Akrapovic exhaust" feature for Suzuki GSXR,
3. Remove "A/c" feature from Suzuki Vitara

All of those presented head-to-head, vanilla javascript and ngrx-immutable "immute" function.
