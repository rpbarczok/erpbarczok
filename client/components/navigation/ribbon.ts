export interface Form {
    name: string
    id: string
    group: string
    permission: string
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
    { name: "Startseite", id: "startForm", group: "start", permission: "user admin", order: 0 },
    { name: "Anfragen", id: "anfragenForm", group: "pro", permission: "user admin", order: 2 },
    { name: "Stammdaten", id: "stammForm", group: "stamm", permission: "user admin", order: 0 },
    { name: "Ansprechpartner", id: "ansprechForm", group: "stamm", permission: "user admin", order: 1 },
    { name: "PR", id: "prForm", group: "stamm", permission: "user admin", order: 2 },
    { name: "Artikel", id: "artForm", group: "art", permission: "user admin", order: 0 },
    { name: "Angebote", id: "angForm", group: "art", permission: "user admin", order: 1 },
    { name: "Prüfmittel", id: "prüfForm", group: "art", permission: "user admin", order: 4 },
    { name: "Aufträge", id: "aufForm", group: "auf", permission: "user admin", order: 0 },
    { name: "AB", id: "abForm", group: "auf", permission: "user admin", order: 1 },
    { name: "Bestellung Lieferant", id: "bestLiefForm", group: "auf",permission: "user admin", order: 2 },
    { name: "Lieferung", id: "lieferForm", group: "lief",permission: "user admin", order: 0 },
    { name: "Lieferschein", id: "liefscheinForm", group: "lief",permission: "user admin", order: 1 },
    { name: "Liefer-Avis", id: "avisForm", group: "lief", permission: "user admin",order: 2 },
    { name: "Speditionsauftrag", id: "spedAufForm", group: "sped", permission: "user admin",order: 0 },
    { name: "Speditions-Rechnung", id: "spedRechForm", group: "sped", permission: "user admin",order: 1 },
    { name: "Waren-ER", id: "warenForm", group: "sped", permission: "user admin",order: 2 },
    { name: "Zwischen-Lager", id: "lagerForm", group: "lag",permission: "user admin", order: 0 },
    { name: "Sicherheitslager", id: "silaForm", group: "lag", permission: "user admin",order: 1 },
    { name: "Auslieferung SiLa", id: "ausliefForm", group: "lag", permission: "user admin",order: 2 },
    { name: "Reklamationen", id: "reklForm", group: "rekl", permission: "user admin",order: 0 },
    { name: "Belastungen", id: "belForm", group: "rekl", permission: "user admin",order: 1 },
    { name: "Gutschriften", id: "gutForm", group: "rekl", permission: "user admin",order: 2 },
    { name: "Muster", id: "musterForm", group: "pro", permission: "user admin",order: 3 },
    { name: "Monster", id: "monsterForm", group: "sonst", permission: "user admin",order: 0 },
    { name: "Rechnung", id: "rechForm", group: "rech", permission: "user admin",order: 0 },
    { name: "Gebühren", id: "gebForm", group: "rech", permission: "user admin",order: 1 },
    { name: "Zahlungsaufforderung", id: "zahlForm", group: "rech", permission: "user admin",order: 2 },
    { name: "Wechselkurs", id: "wechselForm", group: "sonst", permission: "user admin",order: 1 },
    { name: "Taric-Nr", id: "taricForm", group: "sonst", permission: "user admin",order: 2 },
    { name: "Admin", id: "adminForm", group: "admin", permission: "admin",order: 0 }]

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
    { name: "Sonstiges", id: "sonst", order: 9 },
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
