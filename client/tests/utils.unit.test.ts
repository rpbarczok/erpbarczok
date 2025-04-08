import { expect } from "expect"
import { insertInArray } from "utils/insertInArray.js"
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js"


describe('Test utils', function () {

    describe('Test removeStringBeforeLastDigits', function() {
        it('returns 5 with argument "companies/5"', function () {
            expect(removeStringBeforeLastDigits("companies/5")).toBe(5)
        })
    })


    describe('Test insertInArray', function () {
        it('returns [1,2,5,3,4] for insert 5 at index 2', function () {
            expect(insertInArray([1,2,3,4], 5, 2)).toStrictEqual([1,2,5,3,4])
        })

        it('returns [5,1,2,3,4] for insert 5 at index 0', function () {
            expect(insertInArray([1,2,3,4], 5, 0)).toStrictEqual([5,1,2,3,4])
        })

        it('returns [1,2,3,4,5] for insert 5 at index 4', function () {
            expect(insertInArray([1,2,3,4], 5, 4)).toStrictEqual([1,2,3,4,5])
        })
    })
})


