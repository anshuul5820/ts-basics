//this package implicitly adds Reflect obj to global scope
//so no need to import something from 'package'
import 'reflect-metadata'

const plane = {
    color: 'red'
}
//metadata is some info that can be shown only using metadata package

Reflect.defineMetadata('note', 'hi there', plane)
//this is eqivalent to adding 'note' key to plane
//but 'note' could only be accessed using this package

Reflect.defineMetadata('note', 'hi there', plane, 'color')
//associates metadata with plane's color key

const note = Reflect.getMetadata('note', plane, 'color')

console.log('first', plane)
const note1 = Reflect.getMetadata('note', plane, 'color')
console.log(note1)

@printMetadata
class Plane {
    color: string = 'red'

    @markFunction('hello')
    fly(): void {
        console.log('vrrr')
    }
}

function markFunction(secretInfo: string) {
    return function (target: Plane, key: string) {
        Reflect.defineMetadata('secret', secretInfo, target, key)
    }
}

function printMetadata(target: typeof Plane) {
    for (let key in target.prototype) {
        const secret = Reflect.getMetadata('secret', target.prototype, key)
        console.log('42: ', secret)
    }
}

const secret = Reflect.getMetadata('secret', Plane.prototype, 'fly')

console.log(secret) 