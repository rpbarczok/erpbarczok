export function insertInArray<T>(baseArray: T[], item: T, index: number) {
    const arrayFront = baseArray.slice(0,index)
    const arrayBack = baseArray.slice(index)
    return arrayFront.concat([item],arrayBack)
}