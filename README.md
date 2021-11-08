# 🎇 TypeCheck
Check Object Types

```bash
yarn add JustAWaifuHunter/typecheck#master

npm install JustAWaifuHunter/typecheck#master
```

## Example
```js
import TypeCheck from "typing"

const typeObj = {
  name: String
  id: Number
}

const obj = {
   name: "Samantha",
   id: 65645431
}

const objErr = {
   name: "Samantha",
   id: "65645431"
}

TypeCheck(typeObj, obj) // No error

TypeCheck(typeObj, obj) // Error
```
