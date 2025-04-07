
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
    name: "Home", id: "home", auth: "public", order: 0
},
{
    name: "Stammdaten", id: "stamm", auth: "public", order: 1
},
{
    name: "Produkte", id: "prod", auth: "public", order: 2
},
{
    name: "Aufträge", id: "auf", auth: "public", order: 3
},
{
    name: "Rechnungen", id: "rech", auth: "public", order: 4
},
{
    name: "Admin", id: "admin", auth: "admin", order: 5
}
]

const pageList: Page[] = [{
    name: "Home", id: "home", group: "home", auth: "public", order: 0
}, {
    name: "Stammdaten", id: "stamm", group: "stamm", auth: "public", order: 0
}, {
    name: "Marketing", id: "mark", group: "stamm", auth: "public", order: 1
},
{
    name: "Produkte", id: "prod", group: "prod", auth: "public", order: 0
},
{
    name: "Anfragen", id: "anf", group: "prod", auth: "public", order: 1
},
{
    name: "Angebote", id: "ang", group: "prod", auth: "public", order: 2
},
{
    name: "Aufträge", id: "auf", group: "auf", auth: "public", order: 0
},
{
    name: "Bestellungen", id: "best", group: "auf", auth: "public", order: 1
},
{
    name: "Lieferungen", id: "lief", group: "auf", auth: "public", order: 2
},
{
    name: "Rechnungen", id: "rech", group: "rech", auth: "public", order: 0
},
{
    name: "Admin", id: "admin", group: "admin", auth: "public", order: 0
}
]

const groupListSorted = groupList.sort((a, b) => a.order - b.order)
export const ribbonList = groupListSorted.map((group) => {
    const pagesSorted = pageList.filter(form => form.group === group.id).sort((a,b) => a.order - b.order)
    return {...group, pages: pagesSorted}
})
    
