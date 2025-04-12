/*
Copyright (c) 2025 Ralph Barczok
Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export interface Group {
    name: string
    id: string
    auth: string
    order: number
}

export interface Page {
    name: string
    id: string
    group: string
    auth: string
    order: number
}

const groupList: Group[] = [{
    name: "Home", id: "home", auth: "public user admin", order: 0
},
{
    name: "Stammdaten", id: "stamm", auth: "public user admin", order: 1
},
{
    name: "Produkte", id: "prod", auth: "public user admin", order: 2
},
{
    name: "Aufträge", id: "auf", auth: "public user admin", order: 3
},
{
    name: "Rechnungen", id: "rech", auth: "public user admin", order: 4
},
{
    name: "Admin", id: "admin", auth: "admin", order: 5
}
]

const pageList: Page[] = [{
    name: "Home", id: "home", group: "home", auth: "public user admin", order: 0
}, {
    name: "Stammdaten", id: "stamm", group: "stamm", auth: "public user admin", order: 0
}, {
    name: "Marketing", id: "mark", group: "stamm", auth: "public user admin", order: 1
},
{
    name: "Produkte", id: "prod", group: "prod", auth: "public user admin", order: 0
},
{
    name: "Anfragen", id: "anf", group: "prod", auth: "public user admin", order: 1
},
{
    name: "Angebote", id: "ang", group: "prod", auth: "public user admin", order: 2
},
{
    name: "Aufträge", id: "auf", group: "auf", auth: "public user admin", order: 0
},
{
    name: "Bestellungen", id: "best", group: "auf", auth: "public user admin", order: 1
},
{
    name: "Lieferungen", id: "lief", group: "auf", auth: "public user admin", order: 2
},
{
    name: "Rechnungen", id: "rech", group: "rech", auth: "public user admin", order: 0
},
{
    name: "Admin", id: "admin", group: "admin", auth: "admin", order: 0
}
]

const groupListSorted = groupList.sort((a, b) => a.order - b.order)
export const ribbonList = groupListSorted.map((group) => {
    const pagesSorted = pageList.filter(form => form.group === group.id).sort((a,b) => a.order - b.order)
    return {...group, pages: pagesSorted}
})
    
