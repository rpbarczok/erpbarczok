const formArray = [
    { name: "Startseite", id: "startForm", group: "start", order: 0 },
    { name: "Anfragen", id: "anfragenForm", group: "pro", order: 2 },
    { name: "Stammdaten", id: "stammForm", group: "stamm", order: 0 },
    { name: "Ansprechpartner", id: "ansprechForm", group: "stamm", order: 1 },
    { name: "Kampagnen", id: "kamForm", group: "stamm", order: 2 },
    { name: "Projekte", id: "proForm", group: "pro", order: 0 },
    { name: "Angebote", id: "angForm", group: "pro", order: 1 },
    { name: "Prüfmittel", id: "prüfForm", group: "pro", order: 4 },
    { name: "Aufträge", id: "aufForm", group: "auf", order: 0 },
    { name: "AB", id: "abForm", group: "auf", order: 1 },
    { name: "Bestellung Lieferant", id: "bestLiefForm", group: "auf", order: 2 },
    { name: "Lieferung", id: "lieferForm", group: "lief", order: 0 },
    { name: "Lieferschein", id: "liefscheinForm", group: "lief", order: 1 },
    { name: "Liefer-Avis", id: "avisForm", group: "lief", order: 2 },
    { name: "Speditionsauftrag", id: "spedAufForm", group: "sped", order: 0 },
    { name: "Speditions-Rechnung", id: "spedRechForm", group: "sped", order: 1 },
    { name: "Waren-ER", id: "warenForm", group: "sped", order: 2 },
    { name: "Zwischen-Lager", id: "lagerForm", group: "lag", order: 0 },
    { name: "Sicherheitslager", id: "silaForm", group: "lag", order: 1 },
    { name: "Auslieferung SiLa", id: "ausliefForm", group: "lag", order: 2 },
    { name: "Reklamationen", id: "reklForm", group: "rekl", order: 0 },
    { name: "Belastungen", id: "belForm", group: "rekl", order: 1 },
    { name: "Gutschriften", id: "gutForm", group: "rekl", order: 2 },
    { name: "Muster", id: "musterForm", group: "pro", order: 3 },
    { name: "Monster", id: "monsterForm", group: "sonst", order: 0 },
    { name: "Rechnung", id: "rechForm", group: "rech", order: 0 },
    { name: "Gebühren", id: "gebForm", group: "rech", order: 1 },
    { name: "Zahlungsaufforderung", id: "zahlForm", group: "rech", order: 2 },
    { name: "Wechselkurs", id: "wechselForm", group: "sonst", order: 1 },
    { name: "Taric-Nr", id: "taricForm", group: "sonst", order: 2 }]

//* List of all Groups in Ribbon *//
const groupArray = [
    { name: "Start", id: "start", order: 0 },
    { name: "Stammdaten", id: "stamm", order: 1 },
    { name: "Projekte", id: "pro", order: 2 },
    { name: "Aufträge", id: "auf", order: 3 },
    { name: "Lager", id: "lag", order: 6 },
    { name: "Reklamationen", id: "rekl", order: 7 },
    { name: "Lieferungen", id: "lief", order: 4 },
    { name: "Spedition/ER", id: "sped", order: 5 },
    { name: "Rechnungen", id: "rech", order: 8 },
    { name: "Sonstiges", id: "sonst", order: 9 }]


    const groupSort = groupArray.sort((a, b) => a.order - b.order)

    const groupForm = groupSort.map((g) => {
        const formsGroup = formArray.filter(f => (f.group === g.id))
        const formsGroupSort = formsGroup.sort((a, b) => a.order - b.order)
        return (
            { ...g, forms: formsGroupSort }
        )
    })

    export default groupForm