import { FunctionComponent } from "react"
import { Resource, ResourceDescription, ResourcePayloadAndDescription } from "./resourceList.js"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { ListGroup, Row } from "react-bootstrap"
import { ResourcesList } from "./ResourcesList.js"
import { Notes } from "components/notifiers/Notes.js"
import { ResourcesAdd } from "./ResourcesAdd.js"


interface ResourcePageComponent {
    resource: ResourceDescription<Resource>
    resourceList: ResourcePayloadAndDescription<Resource>[]
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourcePage: FunctionComponent<ResourcePageComponent> = ({ resource, resourceList, setIsResourceChanged }) => {
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()

    return (
        <>
            <Row>
                <h1>{resource.name}</h1>
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ResourcesAdd
                    resource={resource}
                    addMainNote={addMainNote}
                    setIsResourceChanged={setIsResourceChanged}
                />
            </Row>
            <Row>
                <ListGroup key={resource.name + '-list'} >
                    <ResourcesList
                        resource={resource}
                        addMainNote={addMainNote}
                        setIsResourceChanged={setIsResourceChanged}
                        resourceList={resourceList}
                    />
                </ListGroup >
            </Row>
        </>
    )
}

