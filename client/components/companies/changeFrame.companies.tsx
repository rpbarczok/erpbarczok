import { Companytype } from "components/admin/companytypes/companytypes.js"
import { DataWithMeta } from "components/forms.js"
import { Company } from "./companies.js"
import { Note } from "components/notifiers/notifiers.js"

interface ChangeFrameCompaniesComponent {
    listCompanytypes: DataWithMeta<Companytype>[]
    activeCompany: DataWithMeta<Company>
    addMainNotes: (note: Note) => void
}

const ChangeFrameCompanies = ({ listCompanytypes, activeCompany, addMainNotes }: ChangeFrameCompaniesComponent) => {
    return (<></>)


    // <Row id="edit">
// {activeCompany.meta.location === 0 ?
//     <p>Keine Firma gefunden</p> :
//     <EditCompanies
//         key={activeCompany.meta.location}
//         listCompanytypes={listCompanytypes}
//         changeCompany={changeCompany}
//         changeCompanyDispatch={changeCompanyDispatch}
//         handleSubmit={handleSubmit}
//         handleDelete={handleDelete}
//     />}
// </Row>

}

export default ChangeFrameCompanies
// const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault()
//     if (changeCompany.data.name !== "") {
//         if (changeCompany.meta.location === 0) {
//             client.postCompany(null, changeCompany.data)
//                 .then((res) => {
//                     handleChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
//                     const note: Note = {
//                         message: `Neue Firma erfolgreich erstellt`,
//                         variant: 'success',
//                     }
//                     addNote(note)
//                     setCompanyIsChanged(true)
//                     setIsNew(true)
//                     setShow(false)
//                     changeCompanyDispatch({ type: 'companyChange', newValue: blandCompany })
//                 })
//                 .catch((error) => {
//                     const note: Note = {
//                         variant: 'danger',
//                         message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
//                     }
//                     addNote(note)
//                 })
//         } else {
//             if (changeCompany.data === activeCompany.data) {
//                 const note: Note = {
//                     variant: 'info',
//                     message: `Es wurden keine Änderungen der Daten der Firma '${changeCompany.data.name}' eingegeben.`,
//                 }
//                 addNote(note)
//             } else {
//                 client.putCompanyById({ id: changeCompany.meta.location, "if-match": changeCompany.meta.etag },
//                     changeCompany.data)
//                     .then((res) => {
//                         const note: Note = {
//                             variant: 'success',
//                             message: `Neue Firma '${changeCompany.data.name}' erfolgreich überarbeitet.`,
//                         }
//                         addNote(note)
//                         setCompanyIsChanged(true)
//                     })
//                     .catch(function (error) {
//                         const note: Note = {
//                             variant: 'danger',
//                             message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
//                         }
//                         addNote(note)
//                     })
//             }
//         }
//     } else {
//         const note: Note = {
//             variant: 'danger',
//             message: `Bitte mindestens einen Namen und eine Firmenrolle eintragen`,
//         }
//         addNote(note)
//     }
// }

// const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault()
//     const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
//     if (userConfirmed) {
//         client.deleteCompanyById(activeCompany.meta.location)
//             .then((res) => {
//                 setCompanyIsChanged(true)
//                 const note: Note = {
//                     variant: 'warning',
//                     message: `Firma wurde gelöscht. Aktuell gibt es keine Möglichkeit, die Daten zurückzuholen`,
//                 }
//                 addNote(note)
//             })
//             .catch(error => {
//                 const note: Note = {
//                     variant: 'danger',
//                     message: `Löschen der Firma hat nicht geklappt: ${error.message}`,
//                 }
//                 addNote(note)
//             })
//     }
// }