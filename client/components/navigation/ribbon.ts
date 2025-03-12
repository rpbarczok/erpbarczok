export interface Form {
    name: string
    id: string
    group: string
    scopes: string
    order: number
}

export interface FormGroup {
    name: string
    id: string
    order: number
}

export interface FormNav extends FormGroup {
    forms: Form[]
}

export interface FormTab {
    name: string
    id: string
}

const formArray: Form[] = [
    { name: "Startseite", id: "startForm", group: "start", scopes: "public user admin", order: 0 },
    { name: "Stammdaten", id: "stammForm", group: "stamm", scopes: "public user admin", order: 0 },
    { name: "Ansprechpartner", id: "ansprechForm", group: "stamm", scopes: "public user admin", order: 1 },
    { name: "PR", id: "prForm", group: "stamm", scopes: "public user admin", order: 2 },
    { name: "Artikel", id: "artForm", group: "art", scopes: "public user admin", order: 0 },
    { name: "Anfragen", id: "anfragenForm", group: "art", scopes: "public user admin", order: 1 },
    { name: "Angebote", id: "angForm", group: "art", scopes: "public user admin", order: 2 },
    { name: "Zoll", id: "zollForm", group: "art", scopes: "public user admin", order: 3 },
    { name: "Aufträge", id: "aufForm", group: "auf", scopes: "public user admin", order: 0 },
    { name: "Bestellung Lieferant", id: "bestLiefForm", group: "auf", scopes: "public user admin", order: 1 },
    { name: "Auftragsbestätigung", id: "abForm", group: "auf", scopes: "public user admin", order: 2 },
    { name: "Lieferung", id: "lieferForm", group: "lief", scopes: "public user admin", order: 0 },
    { name: "Lieferschein", id: "liefscheinForm", group: "lief", scopes: "public user admin", order: 1 },
    { name: "Liefer-Avis", id: "avisForm", group: "lief", scopes: "public user admin", order: 2 },
    { name: "Speditionsauftrag", id: "spedAufForm", group: "sped", scopes: "public user admin", order: 0 },
    { name: "Speditionsrechnung", id: "spedRechForm", group: "sped", scopes: "public user admin", order: 1 },
    { name: "Warenrechnung", id: "warenForm", group: "sped", scopes: "public user admin", order: 2 },
    { name: "Lager", id: "lagerForm", group: "sped", scopes: "public user admin", order: 3 },
    { name: "Auslieferung Lager", id: "ausliefForm", group: "sped", scopes: "public user admin", order: 4 },
    { name: "Reklamationen", id: "reklForm", group: "rekl", scopes: "public user admin", order: 0 },
    { name: "Belastungen", id: "belForm", group: "rekl", scopes: "public user admin", order: 1 },
    { name: "Gutschriften", id: "gutForm", group: "rekl", scopes: "public user admin", order: 2 },
    { name: "Rechnung", id: "rechForm", group: "rech", scopes: "public user admin", order: 0 },
    { name: "Resources", id: "resForm", group: "admin", scopes: "admin", order: 0 }]

//* List of all Groups in Ribbon *//
const groupArray: FormGroup[] = [
    { name: "Start", id: "start", order: 0 },
    { name: "Stammdaten", id: "stamm", order: 1 },
    { name: "Artikel", id: "art", order: 2 },
    { name: "Aufträge", id: "auf", order: 3 },
    { name: "Lager", id: "lag", order: 6 },
    { name: "Reklamationen", id: "rekl", order: 7 },
    { name: "Lieferungen", id: "lief", order: 4 },
    { name: "Spedition/ER", id: "sped", order: 5 },
    { name: "Rechnungen", id: "rech", order: 8 },
    { name: "Admin", id: "admin", order: 10 }
]

const groupSort = groupArray.sort((a, b) => a.order - b.order)


export const groupForm: FormNav[] = groupSort.map((g) => {
    const formsGroup = formArray.filter(f => (f.group === g.id))
    const formsGroupSort = formsGroup.sort((a, b) => a.order - b.order)
    return (
        { ...g, forms: formsGroupSort }
    )
})
