@classDecorator
class Boat {

    @testDecorator
    color: string = 'red'

    @testDecorator
    get formattedColor(): string {
        return `this boat's color is ${this.color}`
    }

    @testDecorator
    pilot(): void {
        console.log('swish')
    }

    @logError
    pilot1(): void {
        throw new Error()
        console.log('swish')
    }

    @logErrorDecoratorFactory('boat was sunk')
    pilot2(): void {
        throw new Error()
        console.log('swish')
    }

    pilot3(
        @parameterDecorator speed: string,
        @parameterDecorator generateWake: string
    ): void {
        if (speed === 'fast') console.log('swish')
        else console.log('nothing')
    }

}


//target: any->actual type:  prototype of class Boat-> Boat
//using Boat can be misleadig, bcoz we using prototpe of class Boat, not obj of class Boat
//so any,
//index: arg no on which decorator is applied
function parameterDecorator(target: any, key: string, index: number) {
    console.log(key, index)
}

function testDecorator(target: any, key: string): void {
    console.log('target', target)
    console.log('key', key)
}


function classDecorator(constructor: typeof Boat) {
    console.log(constructor)
}

function logError(target: any, key: string, propDesc: PropertyDescriptor): void {
    // console.log('target', target)
    // console.log('key', key)

    const method = propDesc.value// refs pilot() fn
    propDesc.value = function () {
        try {
            method()
        } catch (e) {
            console.log('boat was sunk')
        }
    }//run that fn inside decoator, if error, return error
}

//decorator factories- customise a decorator
function logErrorDecoratorFactory(errorMessage: string) {
    return function (target: any, key: string, propDesc: PropertyDescriptor): void {

        const method = propDesc.value// refs pilot() fn
        propDesc.value = function () {
            try {
                method()
            } catch (e) {
                console.log(errorMessage)
            }
        }//run that fn inside decoator, if error, return error
    }

}


//propDesc: property descriptor: es5 feature
//contains config options on object's properties. 
//other words: object that configures props of another object. 

//example of propertydescriptor from browser
// const car={make:'honda', year:2000
// }
// Object.getOwnPropertyDescriptor(cat, 'make')
// Object.getOwnPropertyDescriptor(car, 'make')
// {value: 'honda', writable: true, enumerable: true, configurable: true}
// Object.defineProperty(car, 'make', { writable: false})
// {make: 'honda', year: 2000}
// car.make='chevy'
// car.make = 'honda'


//decorators:
//first arg is all prototypes of class
//2nd arg is name of property/getter/function on which decorator is applied
//3rd arg is property descriptor
//decorators are only executed just once, when class is defined for the first time...
//... class is run & converted into js
//not when instance of class is created. 
//after decorator gets called, ts internally adds propDesc to the prototypes.
//very imp: decorators are useless to be called on properties/getters
//reason: we cant get values of props/getters, can only fetch name of prop(ex: color)
//target[key] is only applicable in functions
//decorators can also be applied on static properties of class