import { client } from "utils/openAPIClientAxios.js"
import { Company } from "./companies.js"
import { DataWithMeta } from "components/forms.js"
import { Note } from "components/notifiers/notifiers.js"
import React from "react"
import { Button } from "react-bootstrap"
import { useAuth } from "react-oidc-context"

interface DeleteCompanyComponent {
    company: DataWithMeta<Company>
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addNote: (note: Note) => void
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeleteCompanies = ({company, setIsCompanyChanged, addNote, setShow }: DeleteCompanyComponent) => {
    const auth = useAuth()
    const token = auth.user?.access_token

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du die Firma '${company.data.name}' wirklich löschen?`)
        if (userConfirmed) {
            client.deleteCompanyById(company.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setIsCompanyChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `Firma wurde gelöscht.`,
                    }
                    if (setShow) {
                        setShow(false)
                    }
                    addNote(note)
                })
                .catch(error => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der Firma hat nicht geklappt: ${error.message}`,
                    }
                    addNote(note)
                })

        }
    }
    return <Button className="standardDesign" variant="outline-danger" onClick={handleDelete}>Firma löschen</Button>
}
