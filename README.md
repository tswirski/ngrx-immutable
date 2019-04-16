# ngrx-immutable

Redux state made easy.

Wile there is lot of other tools in the wild - most of them are either overengineered or do not provide enough flexibility to do the job.  Maintaining Redux state with plain JavaScript might be pain in the...neck - due to nested objects. Therefor lot of people go for the immutable-js along with redux-immutable. While it wokrs perfectly well it also brings thousands lines of code which is not really necessary... especially if you prefere classic approach.

This is how our sample store looks like. 

```var store = {
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
  },
 ...
  ],
  ...
};
```

Let's now do couple of basic Redux store operations. 
For sake of presentation we will:

1. Change Car Model for Audi from "A4 B6" to "R8",
2. Add "Akrapovic exhaust" feature for Suzuki GSXR,
3. Remove "A/c" feature from Suzuki Vitara

All of those presented head-to-head, vanilla javascript and ngrx-immutable "immute" function.

1. Change of Car Model, vanilla javascript
```
const userIndex = store.users.findIndex(...);
const vehicleIndex = store.users[userIndex].ownedVehicles.findIndex(...);

store = {
  ...store,
  users: [
    ...store.users.slice(0, userIndex),
    {
      ...store.users[userIndex],
      ownedVehicles: [
        ...store.users[userIndex].ownedVehicles.slice(0, vehicleIndex),
        {
          ...store.users[userIndex].ownedVehicles[vehicleIndex],
          model: "R8"
        },
        ...store.users[userIndex].ownedVehicles.slice(vehicleIndex + 1),
      ]
    },
    ...store.users.slice(userIndex + 1)
  ]
}
```

? WAT ?

Now do same operation with immute:

```
store = immute(store, [
  'users', 
  (user) => user.id === <something>,
  'ownedVehicles',
  (vehicle) => vehicle.<something> = <something>,
  'model'
], "R8"];
```

It is also possible to use function to produce value:

```
store = immute(store, [
  'users', 
  (user) => user.id === <something>,
  'ownedVehicles',
  (vehicle) => vehicle.<something> = <something>
], (vehicle) => ({ ...vehicle, model: "R8"})];
```


  
